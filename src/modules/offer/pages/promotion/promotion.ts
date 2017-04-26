/***
 * Promotion page that show all offers with discount
 * v1.5.7 ready
 */

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ProductDetailPage } from '../product-detail/product-detail';

import { AppService } from '../../../common/services/app.service';
import { DataService } from '../../../common/services/data.service';

import { ViewStatusEnum } from '../../../common/models/enums';
import { IOffer } from '../../../common/models/interfaces';
import { ModelPage } from '../../../common/pages/model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'promotion.html',
})
export class PromotionPage extends ModelPage {
  products: Array<IOffer> = [];
  toOrder: string;
  rows = [];

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public theApp: AppService,
    public dataService: DataService
  ) {
    super('Promoções');
    this.toOrder = 'price';
  }

  ionViewDidLoad() {
    this.doReset('Promoções');
    this.load();
  }

  load() {
    var self = this;
    this.doChangeView(ViewStatusEnum.Empty);
    this.theApp.util.presentLoading('Carregando Promoções!');

    // order by profitability
    // order by some other metric: most viewers...
    // order in a way that a minor always get a pair

    // for tests
    /*this.dataService.findAll({
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
      });*/

    this.dataService.getPretty({
	  controller: 'offers/sale'
  	}).then((data: Array<IOffer>) => {
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

  itemTapped(event, item) {
    this.navCtrl.push(ProductDetailPage, {
      offer: item
    });
  }
}
