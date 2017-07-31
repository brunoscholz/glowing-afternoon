/**
 * ProductDetailPage class
 *
 * Detail information about one item (product or service)
 * with all it's reviews. The item comes from navParams
 *
*/
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { AppService } from '../../../common/services/app.service';
import { OfferService } from '../../services/offer.service';
import { UserService } from '../../../user/services/user.service';

import { IVoucherFact, IOffer, IUser, IBalance } from '../../../common/models/interfaces';

@Component({
  templateUrl: 'gift-buy.html',
})
export class GiftBuyPage {
  cupom: IVoucherFact;
  product: IOffer;
  bgImage: string;
  user: IUser;
  balance: IBalance;
  title: string = "Confirm";

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public userService: UserService,
    public offerService: OfferService,
    public theApp: AppService
  ) {
    this.cupom = navParams.get('voucher');
    this.product = this.cupom.offer;
    this.bgImage = this.product.picture.cover;
    this.title = this.product.item.title;
  }

  ionViewDidLoad() {
    this.loadAll();
  }

  loadAll() {
    let self = this;
    self.theApp.util.presentLoading('Carregando Saldos!');
    self.load()
    .then((res) => {
      self.changeViewState();
    }, (err) => {
      self.theApp.util.dismissLoading();
      self.theApp.notifyError(err);
    });
  }

  load() {
    let self = this;

    let promise = new Promise((resolve, reject) => {
      self.theApp.authService.getUser()
      .then((usr: IUser) => {
        if(usr) {
          self.user = usr;
          return self.loadBalance(usr);
        }
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
    });
    return promise;

    /*self.auth.checkAuthentication()
    .then((usr: IUser) => {
      if(usr) {
        self.user = usr;
        self.loadBalance();
      }
    }*/
  }

  loadBalance (usr: IUser) {
    var self = this;
    let promise = new Promise((resolve, reject) => {
      // get balance
      self.userService.getBalance({
        controller: 'transaction',
        query: { 'userId': { test: "like binary", value: usr.userId } },
        asset: 'coin'
      }).then((bal) => {
        self.balance = <IBalance>bal['balance'];
        resolve(true);
      }, (err) => {
        reject(err);
      });
    });
    return promise;
  }

  changeViewState() {
    this.theApp.util.dismissLoading();
  }

  moneyFormat(n, currency) {
    return currency + " " + n.toFixed(2).replace(/./g, function(c, i, a) {
      return i && c !== '.' && ((a.length - i) % 3 === 0) ? ',' + c : c;
    });
  }

  confirm(): void {
    // generate qrcode...
    let self = this;
    let confirm = this.alertCtrl.create({
      title: 'Confirmar a troca?',
      message: 'Trocar ' + this.moneyFormat(this.cupom.voucher.discount * 1000, 'OTK') + ' por ' + (this.cupom.voucher.discount) + '% de desconto?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Concordo',
          handler: () => {
            self.agreed();
          }
        }
      ]
    });
    confirm.present();
  }

  agreed() {
    console.log('Agree clicked');
    // make transaction and relationship from user to seller (open tiket - receiveVoucher)
    // next, when using/consuming, make transaction and relationship from seller to ondetem
    let self = this;
    self.theApp.util.presentLoading('Aguarde..');

    console.log(self.user);

    let body = {
      VoucherModel: {
        buyerId: self.user.buyer.buyerId,
        offerId: self.product.offerId,
        voucherFactId: self.cupom.voucherFactId
      }
    };

    self.offerService.buyVoucher({
      data: body
    })
    .then((data) => {
      if(data['status'] == 200) {
        self.theApp.util.presentToast('O cupom foi trocado com sucesso!');
        self.theApp.util.dismissLoading();
      }
    }, (err) => {
      console.log(err);
      self.theApp.notifyError(err);
      self.theApp.util.dismissLoading();
    });

  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }
}
