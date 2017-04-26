import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import { SubCategoryPage } from '../sub-category/sub-category';

import { ProductPage } from '../product/product';

import { AppService } from '../../../common/services/app.service';
import { DataService } from '../../../common/services/data.service';

import { ViewStatusEnum } from '../../../common/models/enums';
import { ICategory } from '../../../common/models/interfaces';
import { ModelPage } from '../../../common/pages/model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'category.html'
})
export class CategoryPage extends ModelPage {
  categories: ICategory[] = [];
  rows: any;

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public dataService: DataService,
    public theApp: AppService
  ) {
    super('Categorias');
  }

  ionViewDidLoad() {
    //this.doReset('Categorias');
    this.load();
  }

  load() {
    var self = this;
    self.theApp.util.presentLoading('Buscando...');
    self.dataService.findAll({
      controller: 'categories',
      query: { parentId: 0 }
    }).then((categories: Array<ICategory>) => {
      self.categories = categories;
      self.rows = Array.from(Array(Math.ceil(self.categories.length / 2)).keys());
      self.changeViewState(true);
    });
  }

  changeViewState(b: boolean) {
    this.doChangeViewState(b);
    this.theApp.util.dismissLoading();
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.load();
  }

  morethantworows(i) {
    return (i > 2) ? 'show-more-target' : '';
  }

  showButton() {
    if (_.size(this.rows) > 3)
      return true;

    return false;
  }

  itemTapped(event, item) {
    this.navCtrl.push(ProductPage, {
      category: item
    });
  }

}
