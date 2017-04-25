/**
 * CatalogPage class
 *
 * Lists all offers for a given (selectedItem) company
 * 
 * It subscribes to dataService.offers$ and on change
 * it loads the results into the @property products
 *
 * Same as ProductPage, but for companies' offers
 */

import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { ProductDetailPage } from '../product-detail/product-detail';

import { AppService } from '../../modules/common/services/app.service';
import { DataService } from '../../modules/common/services/data.service';

//import _ from 'underscore';

@Component({
  templateUrl: 'catalog.html',
})
export class CatalogPage {
  title: string;
  company: any;
	offers: any = [];
  toOrder: string;

  constructor(private navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public dataService: DataService,
              public theApp: AppService
  ) {
  	this.company = navParams.get('item');
    this.offers = navParams.get('offers');
    this.toOrder = 'name';
    this.title = this.company.name;
  }

  favThis(event, item) {}

  itemTapped(event, item) {
    this.navCtrl.push(ProductDetailPage, {
      item: item
    });
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }
}
