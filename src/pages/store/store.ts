/***
 * Store page that show all gifts available
 * v1.5.7 ready
 */
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ProductDetailPage } from '../product-detail/product-detail';

import { AppService } from '../../modules/common/services/app.service';
import { DataService } from '../../modules/common/services/data.service';

import { ViewStatusEnum } from '../../modules/common/models/enums';
import { IOffer } from '../../modules/common/models/interfaces';
import { ModelPage } from '../../modules/common/models/model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'store.html',
})
export class StorePage extends ModelPage {
  products: Array<IOffer> = [];
  toOrder: string;
  rows = [];

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public theApp: AppService,
    public dataService: DataService
  ) {
    super('Loja');
    this.toOrder = 'price';
  }

  ionViewDidLoad() {
    this.doReset('Loja');
    this.load();
  }

  load() {
    var self = this;
    this.doChangeView(ViewStatusEnum.Empty);
    this.theApp.util.presentLoading('Carregando Brindes!');

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
      controller: 'gifts',
      url: 'offers/gifts'
    }).then((data: Array<IOffer>) => {
        self.products = data;
        self.rows = Array.from(Array(Math.ceil(self.products.length / 2)).keys());
        self.changeViewState(_size(self.products) > 0);
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
