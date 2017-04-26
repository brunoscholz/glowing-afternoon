/**
 * ProductPage class
 *
 * Lists all offers for a given (selectedItem) category
 * 
 * It subscribes to dataService.offers$ and on change
 * it loads the results into the @property products
 *
*/

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductDetailPage } from '../product-detail/product-detail';

import { AppService } from '../../../common/services/app.service';
import { DataService } from '../../../common/services/data.service';

import { ViewStatusEnum } from '../../../common/models/enums';
import { ICategory, IOffer } from '../../../common/models/interfaces';
import { ModelPage } from '../../../common/pages/model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'product.html',
})
export class ProductPage extends ModelPage {
  category: ICategory;
	products: Array<IOffer> = [];
  //groupedOffers: any = [];
  toOrder: string;

  constructor(
    private navCtrl: NavController,
    navParams: NavParams,
    public theApp: AppService,
    public dataService: DataService
  ) {
  	super('Produtos');
  	this.category = navParams.get('category');
    this.toOrder = 'name';
  }

  ionViewDidLoad() {
    this.doReset(this.category.name);
    this.load();
  }

  load() {
    var self = this;
    this.doChangeView(ViewStatusEnum.Empty);
    this.theApp.util.presentLoading('Carregando Produtos!');

    this.dataService.findAll({
      controller: 'offers',
      query: { 'item.categoryId': { test: "like binary", value: this.category.categoryId } }
    }).then((data: Array<IOffer>) => {
        self.products = data;
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

  favThis(event, item) {}

  itemTapped(event, item) {
    this.navCtrl.push(ProductDetailPage, {
      offer: item
    });
  }

}
