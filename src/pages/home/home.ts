import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { CategoryPage } from '../category/category';
import { ProductPage } from '../product/product';
import { DataService } from '../../providers/services/data.service';
import { LoadingService } from '../../providers/services/loading.service';
import { LoadingModal } from '../../components/loading-modal/loading-modal';

import { SearchPage } from '../search/search';

import { ViewStatusEnum } from '../../providers/enums';
import { ICategory } from '../../providers/interfaces';
import { ModelPage } from '../model-page';

import _ from 'underscore';

@Component({
  templateUrl: './home.html'
  //selector: 'page-home',
  //providers: [LocationTracker]
})
export class HomePage extends ModelPage implements OnInit {
  categories: ICategory[] = [];
  rows: any;
  formData: any = {q:''};

  constructor(public navCtrl: NavController, navParams: NavParams, public dataService: DataService, public loading: LoadingService) {
    super('OndeTem?!', dataService, loading);
    //this.selectedItem = navParams.get('item');
  }

  ngOnInit() {
    var self = this;
    /*const searchSource = this.searchTermStream
      .debounceTime(1000)
      .distinctUntilChanged()
      .map(searchTerm => {
        this.terms = searchTerm
        return {search: searchTerm, page: 1}
      })*/
    self.dataService.categories$.subscribe((categories: Array<ICategory>) => {
      self.categories = categories;
      self.rows = Array.from(Array(Math.ceil(self.categories.length / 3)).keys());
      self.changeViewState();
      if(self.refresher)
        self.refresher.complete();
    });
  }

  ionViewWillEnter() {
    this.doReset('OndeTem?!');
    this.load();
  }

  itemTapped(event, item) {
    this.navCtrl.push(ProductPage, {
      item: item
    });
  }

  changeViewState() {
    if (_.size(this.categories) > 0) {
      this.doChangeView(ViewStatusEnum.Full);
    }
    else {
      this.doChangeView(ViewStatusEnum.Empty);
    }
    this.doToggleLoading(false);
  }

  doRefresh(refresher) {
    //this.refresher = refresher;
    this.load();
  }

  load() {
    this.doToggleLoading(true);
    //this.doQuery({ collectionName: 'dimCategory', query: { parent: 0 }, sortOrder: { 'code': 1 } });
    this.dataService.findAll({ controller: 'categories', query: { parentId: 0 } });
  }

  open(event, item) {
    switch(item) {
      case 'cat':
        this.navCtrl.push(CategoryPage);
        break;
      case 'search':
        this.navCtrl.push(SearchPage);
        break;
      case 'mic':
        this.navCtrl.push(SearchPage);
        break;
    }
  }

  morethantworows(i) {
    return (i > 1) ? 'show-more-target' : '';
  }

  onInput() {
    if(this.formData.q == '')
      return;

    this.navCtrl.push(SearchPage, {term: this.formData.q});
  }

  onCancel() {}
}
