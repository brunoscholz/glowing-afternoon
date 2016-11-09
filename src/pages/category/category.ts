import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import { SubCategoryPage } from '../sub-category/sub-category';
import { ProductPage } from '../product/product';
import { DataService } from '../../providers/services/data.service';
import { LoadingService } from '../../providers/services/loading.service';
import { LoadingModal } from '../../components/loading-modal/loading-modal';

import { ViewStatusEnum } from '../../providers/enums';
import { ICategory } from '../../providers/interfaces';
import { ModelPage } from '../model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'category.html'
})
export class CategoryPage extends ModelPage implements OnInit {
  categories: ICategory[] = [];
  rows: any;

  constructor(public navCtrl: NavController, navParams: NavParams, public dataService: DataService, public loading: LoadingService) {
    super('Categories', dataService, loading);
    this.selectedItem = navParams.get('item');
  }

  ngOnInit() {
    var self = this;
    self.dataService.categories$.subscribe((categories: Array<ICategory>) => {
      self.categories = categories;
      self.rows = Array.from(Array(Math.ceil(self.categories.length / 3)).keys());
      self.changeViewState();
      if(self.refresher)
        self.refresher.complete();
    });
  }

  ionViewWillEnter() {
    this.doReset('Categories');
    this.load();
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
    this.refresher = refresher;
    this.load();
  }

  load() {
    this.doToggleLoading(true);
    this.dataService.findAll({ controller: 'categories', query: { parentId: 0 } });
  }

  morethantworows(i) {
    return (i > 1) ? 'show-more-target' : '';
  }

  showButton() {
    if (_.size(this.rows) > 2)
      return true;

    return false;
  }

  // changeDisplayMode(mode: DisplayModeEnum) {
  //   this.displayMode = mode;
  // }

  itemTapped(event, item) {
    //this.navCtrl.push(SubCategoryPage, {
    this.navCtrl.push(ProductPage, {
      item: item
    });
  }

}
