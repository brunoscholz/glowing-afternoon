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

import { ViewStatusEnum } from '../../../common/models/enums';
import { IOffer } from '../../../common/models/interfaces';
import { ModelPage } from '../../../common/pages/model-page';

//import _ from 'underscore';

@Component({
  templateUrl: 'catalog.html',
})
export class CatalogPage extends ModelPage {
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
    super("Catálogo");
  	this.company = navParams.get('item');
    // this.offers = this.company.offers; //navParams.get('offers');
    // this.title = this.company.name;
    this.toOrder = 'name';
  }

  ionViewWillEnter() {
    this.doReset(this.company.name);
    this.doChangeView(ViewStatusEnum.Loading);

    this.load();
  }

  load() {
    var self = this;
    this.doChangeView(ViewStatusEnum.Empty);
    this.theApp.util.presentLoading('Buscando...');

    self.offerService.getCatalog({
      sellerId: self.company.sellerId
    }).then((data: Array<IOffer>) => {
      self.offers = data;
      console.log(data);
      self.theApp.util.dismissLoading();
      self.changeViewState(true);
      /*
      if(self.refresher)
        self.refresher.complete();*/
    }, (err) => {
      console.log(err);
      self.changeViewState(false);
    });
  }

  changeViewState(b: boolean) {
    this.doChangeViewState(b);
    this.theApp.util.dismissLoading();
  }

  doRefresh(refresher) {
    //this.refresher = refresher;
    this.load();
  }

  favThis(event, item) {}

  itemTapped(event, item) {
    this.navCtrl.push(ProductDetailPage, {
      offer: item
    });
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }
}
