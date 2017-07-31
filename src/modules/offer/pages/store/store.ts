/***
 * Store page that show all gifts available
 * v1.5.7 ready
 */
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { ProductDetailPage } from '../product-detail/product-detail';

import { AppService } from '../../../common/services/app.service';
import { OfferService } from '../../services/offer.service';

import { GiftBuyPage } from '../gift/gift-buy';

import { ViewStatusEnum } from '../../../common/models/enums';
import { IVoucherFact } from '../../../common/models/interfaces';
import { ModelPage } from '../../../common/pages/model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'store.html',
})
export class StorePage extends ModelPage {
  products: Array<IVoucherFact> = [];
  toOrder: string;
  rows = [];

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public modCtrl: ModalController,
    public theApp: AppService,
    public offerService: OfferService
  ) {
    super('Vouchers');
    this.toOrder = 'price';
  }

  ionViewWillEnter() {
    this.doReset('Vouchers');
    this.load();
  }

  load() {
    var self = this;
    this.doChangeView(ViewStatusEnum.Empty);
    this.theApp.util.presentLoading('Carregando Vouchers!');

    this.offerService.getOffers({
      controller: 'offers/vouchers',
      query: {}
    }).then((data: Array<IVoucherFact>) => {
        self.products = data;
        self.rows = Array.from(Array(Math.ceil(self.products.length / 2)).keys());
        self.changeViewState(_.size(self.products) > 0);
        if(self.refresher)
          self.refresher.complete();
      }, (err) => {
        console.log(err);
      });
  }

  changeViewState(b: boolean) {
    this.doChangeViewState(b);
    this.theApp.util.dismissLoading();
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.load();
  }

  buyVoucher(event, item) {
    /*this.navCtrl.push(GiftBuyPage, {
      voucher: item
    });*/
    let modal = this.modCtrl.create(GiftBuyPage, { voucher: item });
    modal.onDidDismiss(ret => {});
    modal.present();
  }

  itemTapped(event, item) {
    this.navCtrl.push(ProductDetailPage, {
      voucher: item,
      offer: item.offer
    });
  }
}
