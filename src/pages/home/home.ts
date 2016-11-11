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
  formData: any = {q:''};

  constructor(public navCtrl: NavController, navParams: NavParams, public dataService: DataService, public loading: LoadingService) {
    super('OndeTem?!', dataService, loading);
    this.doToggleLoading(false);
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
  }

  ionViewWillEnter() {
    this.doReset('OndeTem?!');
  }

  changeViewState() {
    this.doToggleLoading(false);
  }

  doRefresh(refresher) {
    //this.refresher = refresher;
    //this.load();
  }

  load() {}

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
