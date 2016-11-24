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

import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductDetailPage } from '../product-detail/product-detail';
import { DataService } from '../../providers/services/data.service';
import { LoadingService } from '../../providers/services/loading.service';

import { ViewStatusEnum } from '../../providers/enums';
//import { IProductFact } from '../../providers/interfaces';
import { ModelPage } from '../model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'catalog.html',
})
export class CatalogPage extends ModelPage implements OnInit {
	products: any = [];
  groupedOffers: any = [];
  toOrder: string;

  constructor(private navCtrl: NavController, navParams: NavParams, public dataService: DataService, public loading: LoadingService) {
  	super('Ofertas', dataService, loading)
  	this.selectedItem = navParams.get('item');
    this.toOrder = 'name';
  }

  ngOnInit() {
  	var self = this;
    // get offers by category
  	this.dataService.offers$
	    .subscribe(
	      (data) => {
          self.products = data;
          this.initializeItems();
	      	self.changeViewState();
	        if(self.refresher)
	          self.refresher.complete();
	      },
	      (err) => { console.log(err); },
	      () => {}
	    );
  }

  ngAfterContentInit() {
    this.doReset(this.selectedItem.title);
    this.load();
  }

  initializeItems() {
    //let test = _.groupBy(this.products, 'category');

    this.groupedOffers = [];
    /*for (var key in test) {
      let cat = this.dataService.getCategory({ id: Number(key) });
      let entry = { group: {id: cat.id, title: cat.title}, items: test[key] };
      this.groupedOffers.push(entry);
    }*/
  }

  changeViewState() {
    if (_.size(this.products) > 0) {
      this.doChangeView(ViewStatusEnum.Full);
    }
    else {
      this.doChangeView(ViewStatusEnum.Empty);
    }
  	this.doToggleLoading(false);
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.load();
  }

  load() {
    this.dataService.findItems({ query: { category: this.selectedItem.id } });
  	//this.dataService.getProducts({ collectionName: 'factProduct', query: { categoryId: this.selectedItem._id } })
  }

  favThis(event, item) {}

  itemTapped(event, item) {
    this.navCtrl.push(ProductDetailPage, {
      item: item
    });
  }

}
