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
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { ViewStatusEnum } from '../../providers/utils/enums';
import { ICategory, IOffer } from '../../providers/data/interfaces';
import { ModelPage } from '../model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'product.html',
})
export class ProductPage extends ModelPage {
  category: ICategory;
	products: Array<IOffer> = [];
  //groupedOffers: any = [];
  toOrder: string;

  constructor(private navCtrl: NavController,
              navParams: NavParams,
              public dataService: DataService,
              public util: UtilProvider) {
  	super('Ofertas', dataService, util)
  	this.category = this.selectedItem = navParams.get('category');
    this.toOrder = 'name';
  }

  ionViewDidLoad() {
    this.doReset(this.category.name);
    this.load();
  }

  load() {
    var self = this;
    this.doChangeView(ViewStatusEnum.Empty);
    this.util.presentLoading('Carregando Ofertas!');

    this.dataService.findAll({
      controller: 'offers',
      query: { 'item.categoryId': { test: "like binary", value: this.category.categoryId } }
    }).then((data: Array<IOffer>) => {
        self.products = data;
        self.changeViewState();
        if(self.refresher)
          self.refresher.complete();
      }, (err) => {
        console.log(err);
      });
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

  favThis(event, item) {}

  itemTapped(event, item) {
    this.navCtrl.push(ProductDetailPage, {
      offer: item
    });
  }

}
