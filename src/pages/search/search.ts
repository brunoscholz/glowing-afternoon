import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular'; //reorderArray

import { ProductDetailPage } from '../product-detail/product-detail';
import { ProductPage } from '../product/product';
// ProductPage for categories or companies
// CompanyPage
// CategoryPage

import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { ViewStatusEnum } from '../../providers/utils/enums';
//import { IOffer, IBuyer, ISeller } from '../../providers/interfaces';
import { ModelPage } from '../model-page';
import 'rxjs/add/operator/debounceTime';
import _ from 'underscore';

@Component({
  templateUrl: 'search.html'
})
export class SearchPage extends ModelPage {
  searchTerm: string = '';
  items: any = [];
  //groupedOffers: any = [];

  constructor(public navCtrl: NavController,
              navParams: NavParams,
              public dataService: DataService,
              public util: UtilProvider) {
    super('Busca', dataService, util)
  	this.searchTerm = navParams.get('term') || '';
  }

  ionViewDidLoad() {
    this.doReset('Busca');
    this.load();
  }

  load() {
    var self = this;
    this.doChangeView(ViewStatusEnum.Empty);
    this.util.presentLoading('Buscando...');

    // searchFor : {offers} -> offers only
    // searchFor : {offers, users} -> offers and users
    this.dataService.search({ term: this.searchTerm })
      .then((data) => {
        self.items = data;
        self.changeViewState();
        if(self.refresher)
          self.refresher.complete();
      }, (err) => {
        console.log(err);
      });
  }

  changeViewState() {
    if (_.size(this.items) > 0) {
      this.doChangeView(ViewStatusEnum.Full);
    }
    else {
      this.doChangeView(ViewStatusEnum.Empty);
    }
    this.util.dismissLoading();
  }

  doRefresh(refresher) {
    this.load();
  }

  onInput() {
    if(this.searchTerm == '')
      return;

    console.log(this.searchTerm);
  }

  onCancel() {

  }

  getItems(ev: any) {
    // set val to the value of the searchbar
    //let val = ev.target.value;
    //this.filterItems(val);
  }

  reorderItems(indexes) {
    // reorder="true" (ionItemReorder)="reorderItems($event)"
    //this.items = reorderArray(this.items, indexes);
  }

  catTapped(event, item) {
    this.navCtrl.push(ProductPage, {
      category: item
    });
  }

	itemTapped(event, item) {
    this.navCtrl.push(ProductDetailPage, {
      offer: item
    });
  }

  userTapped(event, item) {
    this.navCtrl.push(ProductDetailPage, {
      user: item
    });
  }

  companyTapped(event, item) {
    this.navCtrl.push(ProductDetailPage, {
      company: item
    });
  }
}
