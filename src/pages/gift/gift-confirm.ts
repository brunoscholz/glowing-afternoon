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
import _ from 'underscore';

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
    this.load();
  }

  load() {
    let self = this;
    self.util.presentLoading('Carregando Saldo!');
    self.auth.checkAuthentication()
    .then((usr: IUser) => {
      if(usr) {
        self.user = usr;
        self.loadBalance();
      }
    }, (err) => {
      console.log(err);
      self.changeViewState();
    });
  }

  loadBalance() {
    let self = this;
    self.dataService.getBalance({
      controller: 'loyalty',
      query: { 'userId': { test: "like binary", value: self.user.userId } }
    }).then((loyal: any) => {
      //self.tx = <ILoyalty[]>loyal['loyalties'];
      self.balance = <IBalance>loyal['balance'];
      self.changeViewState();
    }, (err) => {
      console.log(err);
      self.changeViewState();
    });
  }

  changeViewState() {
    this.util.dismissLoading();
  }

  confirm(): void {
    this.viewCtrl.dismiss();
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }
}
