/***
 * Promotion page that show all offers with discount
 * v1.5.7 ready
 */

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ProductDetailPage } from '../product-detail/product-detail';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { ViewStatusEnum } from '../../providers/utils/enums';
import { IOffer } from '../../providers/data/interfaces';
import { ModelPage } from '../model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'promotion.html',
})
export class PromotionPage extends ModelPage {
  products: Array<IOffer> = [];
  toOrder: string;
  rows = [];

  constructor(public navCtrl: NavController,
              navParams: NavParams,
              public dataService: DataService,
              public util: UtilProvider
  ) {
    super('Promoções', dataService, util);
    this.toOrder = 'price';
  }

  ionViewDidLoad() {
    this.doReset('Promoções');
    this.load();
  }

  load() {
    var self = this;
    this.doChangeView(ViewStatusEnum.Empty);
    this.util.presentLoading('Carregando Promoções!');

    this.dataService.findAll({
      controller: 'offers',
      query: { 'item.categoryId': {"test":"like binary","value":""} }
    }).then((data: Array<IOffer>) => {
        self.products = data;
        self.rows = Array.from(Array(Math.ceil(self.products.length / 2)).keys());
        self.changeViewState();
        if(self.refresher)
          self.refresher.complete();
      }, (err) => {
        console.log(err);
      });

    /*this.dataService.getPretty({
	  controller: 'sale',
      url: 'offers/sale'
  	}).then((data: Array<IOffer>) => {
        self.products = data;
        self.changeViewState();
        if(self.refresher)
          self.refresher.complete();
      }, (err) => {
        console.log(err);
      });*/
  }

  changeViewState() {
    if (_.size(this.products) > 0) {
      this.doChangeView(ViewStatusEnum.Full);
    }
    else {
      this.doChangeView(ViewStatusEnum.Empty);
    }
  	this.util.dismissLoading();
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.load();
  }

  itemTapped(event, item) {
    this.navCtrl.push(ProductDetailPage, {
      offer: item
    });
  }
}
