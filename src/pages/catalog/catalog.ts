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
import { NavController, NavParams } from 'ionic-angular';
import { ProductDetailPage } from '../product-detail/product-detail';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { ViewStatusEnum } from '../../providers/utils/enums';
//import { IProductFact } from '../../providers/interfaces';
import { ModelPage } from '../model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'catalog.html',
})
export class CatalogPage extends ModelPage {
	products: any = [];
  toOrder: string;

  constructor(private navCtrl: NavController,
              navParams: NavParams,
              public dataService: DataService,
              public util: UtilProvider
  ) {
  	super('Ofertas', dataService, util)
  	this.selectedItem = navParams.get('item');
    this.toOrder = 'name';
  }

  ngOnInit() {
  	//var self = this;
    // get offers by category
  	/*this.dataService.offers$
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
	    );*/
  }

  ionViewDidLoad() {
    this.doReset(this.selectedItem.title);
    this.load();
  }

  changeViewState() {
    if (_.size(this.products) > 0) {
      this.doChangeView(ViewStatusEnum.Full);
    }
    else {
      this.doChangeView(ViewStatusEnum.Empty);
    }
  	//this.doToggleLoading(false);
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.load();
  }

  load() {
    //this.dataService.findItems({ query: { category: this.selectedItem.id } });
  	//this.dataService.getProducts({ collectionName: 'factProduct', query: { categoryId: this.selectedItem._id } })
  }

  favThis(event, item) {}

  itemTapped(event, item) {
    this.navCtrl.push(ProductDetailPage, {
      item: item
    });
  }

}
