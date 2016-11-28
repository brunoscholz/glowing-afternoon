/**
 * ProductPage class
 *
 * Lists all offers for a given (selectedItem) category
 * 
 * It subscribes to dataService.offers$ and on change
 * it loads the results into the @property products
 *
*/

import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductDetailPage } from '../product-detail/product-detail';
import { DataService } from '../../providers/services/data.service';
import { LoadingService } from '../../providers/services/loading.service';

import { ViewStatusEnum } from '../../providers/enums';
import { ICategory, IOffer } from '../../providers/interfaces';
import { ModelPage } from '../model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'product.html',
})
export class ProductPage extends ModelPage implements OnInit {
  category: ICategory;
	products: Array<IOffer> = [];
  groupedOffers: any = [];
  toOrder: string;

  constructor(private navCtrl: NavController, navParams: NavParams, public dataService: DataService, public loading: LoadingService) {
  	super('Ofertas', dataService, loading)
  	this.category = this.selectedItem = navParams.get('category');
    this.toOrder = 'name';
  }

  ngOnInit() {
  	var self = this;
    // get offers by category
  	this.dataService.offers$
	    .subscribe(
	      (data) => {
          self.products = data;
          console.log(data);
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
    this.doReset(this.category.name);
    this.load();
  }

  initializeItems() {
    //let test = _.groupBy(this.products, 'category');

    /*this.groupedOffers = [];
    for (var key in test) {
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
    this.dataService.findAll({
      controller: 'offers',
      query: { 'item.categoryId': { test: "like binary", value: this.category.categoryId } }
    });
  }

  favThis(event, item) {}

  itemTapped(event, item) {
    this.navCtrl.push(ProductDetailPage, {
      offer: item
    });
  }

}
