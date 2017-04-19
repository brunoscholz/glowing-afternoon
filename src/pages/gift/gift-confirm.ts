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

import { DataService } from '../../providers/data/data.service';
import { AuthService } from '../../providers/auth/auth.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { IOffer, IUser, IBalance } from '../../providers/data/interfaces';
//import _ from 'underscore';

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
    public auth: AuthService,
    public util: UtilProvider
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
    self.util.presentLoading('Carregando Saldos!');
    self.load()
    .then((res) => {
      self.changeViewState();
    }, (err) => {
      self.util.dismissLoading();
      self.util.notifyError(err);
    });
  }

  load() {
    let self = this;

    let promise = new Promise((resolve, reject) => {
      self.auth.getUserInfo()
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
    this.util.dismissLoading();
  }

  confirm(): void {
    // generate qrcode...
    this.viewCtrl.dismiss();
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }
}
