import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, reorderArray } from 'ionic-angular';

import { ProductDetailPage } from '../product-detail/product-detail';
import { ProductPage } from '../product/product';
// ProductPage for categories or companies
// CompanyPage
// CategoryPage

import { DataService } from '../../providers/services/data.service';
import { LoadingService } from '../../providers/services/loading.service';
import { LoadingModal } from '../../components/loading-modal/loading-modal';

//import { ArrayFilterPipe } from '../../pipes/array-filter';

import { ViewStatusEnum } from '../../providers/enums';
//import { IProductFact } from '../../providers/interfaces';
import { ModelPage } from '../model-page';
import 'rxjs/add/operator/debounceTime';
import _ from 'underscore';

@Component({
  templateUrl: 'search.html'
})
export class SearchPage extends ModelPage implements OnInit {
	products: any = [];
  searchTerm: string = '';
  items: any = [];
  groupedOffers: any = [];
  query: string = "";

  constructor(public navCtrl: NavController, navParams: NavParams, public dataService: DataService, public loading: LoadingService) {
    super('Busca', dataService, loading)
  	this.searchTerm = navParams.get('term') || '';
  }

  ngOnInit() {
    var self = this;
  	this.dataService.items$
	    .subscribe(
	      (data) => {
	      	self.products = data;
          if(this.searchTerm != null && this.searchTerm != '') {
            this.filterItems(this.searchTerm);
            this.initializeItems();
          }

	      	self.changeViewState();
	        if(self.refresher)
	          self.refresher.complete();
	      },
	      (err) => { console.log(err); },
	      () => {}
	    );

    this.doReset('Busca');
    this.load();
  }

  ionViewDidLoad() {
    /*this.searchControl.valueChanges.debounceTime(700)
      .subscribe(search => {
        this.load();
      });*/
    this.initializeItems();
  }

  changeViewState() {
    if (_.size(this.groupedOffers) > 0) {
      this.doChangeView(ViewStatusEnum.Full);
    }
    else {
      this.doChangeView(ViewStatusEnum.Empty);
    }
  	this.doToggleLoading(false);
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

  load() {
  	//this.dataService.getProducts({ collectionName: 'factProduct', query: { } })
    this.dataService.findAllItems();
  	//this.items = this.dataService.filterItems(this.searchTerm);
  }

  filterItems(term) {
    // if the value is an empty string don't filter the items
    if (term && term.trim() != '' && term.length > 3) {
      this.items = this.products.filter((item) => {
        return (item.title.toLowerCase().indexOf(term.toLowerCase()) > -1);
      })
    } else {
      this.items = [];
    }
	}

  initializeItems() {
    let test = _.groupBy(this.items, 'category');
    
    this.doChangeView(ViewStatusEnum.Empty);
    this.groupedOffers = [];
    for (var key in test) {
      let cat = this.dataService.getCategory({ id: Number(key) });
      let entry = { category: cat, items: test[key] };
      this.groupedOffers.push(entry);
    }
    this.changeViewState();
  }

  getItems(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;
    this.filterItems(val);
    this.initializeItems();
  }

  reorderItems(indexes) {
    // reorder="true" (ionItemReorder)="reorderItems($event)"
    this.items = reorderArray(this.items, indexes);
  }

  catTapped(event, item) {
    this.navCtrl.push(ProductPage, {
      item: item
    });
  }

	itemTapped(event, item) {
    this.navCtrl.push(ProductDetailPage, {
      item: item
    });
  }
}
