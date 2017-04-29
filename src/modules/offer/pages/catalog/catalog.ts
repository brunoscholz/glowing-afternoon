/**
 * CatalogPage class
 *
 * Lists all offers for a given (selectedItem) company
 *
 * Same as ProductPage, but for companies' offers
 */

import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { ProductDetailPage } from '../product-detail/product-detail';

import { AppService } from '../../../common/services/app.service';
import { OfferService } from '../../services/offer.service';

//import _ from 'underscore';

@Component({
  templateUrl: 'catalog.html',
})
export class CatalogPage {
  title: string;
  company: any;
	offers: any = [];
  toOrder: string;

  constructor(
    private navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public offerService: OfferService,
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
