/**
 * ProductDetailPage class
 *
 * Detail information about one item (product or service)
 * with all it's reviews. The item comes from navParams
 * 
 * It subscribes to dataService.reviews$ and on change
 * it loads the results into the @property review based on the query
 * in the load method
 *
*/
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { AppService } from '../../../common/services/app.service';
import { DataService } from '../../../common/services/data.service';

import { IOffer, IUser, IBalance } from '../../../common/models/interfaces';

@Component({
  templateUrl: 'gift-confirm.html',
})
export class GiftConfirmPage {
  product: IOffer;
  bgImage: string;
  user: IUser;
  balance: IBalance;
  title: string = "Confirm";

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public viewCtrl: ViewController,
    public dataService: DataService,
    public theApp: AppService
  ) {
    this.product = navParams.get('offer');
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
      self.dataService.getBalance({
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

  confirm(): void {
    // generate qrcode...
    this.viewCtrl.dismiss();
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }
}
