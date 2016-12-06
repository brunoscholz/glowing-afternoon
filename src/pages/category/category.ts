import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import { SubCategoryPage } from '../sub-category/sub-category';
import { ProductPage } from '../product/product';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { ViewStatusEnum } from '../../providers/utils/enums';
import { ICategory } from '../../providers/data/interfaces';
import { ModelPage } from '../model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'category.html'
})
export class CategoryPage extends ModelPage {
  categories: ICategory[] = [];
  rows: any;

  constructor(public navCtrl: NavController,
              navParams: NavParams,
              public dataService: DataService,
              public util: UtilProvider
  ) {
    super('Categorias', dataService, util);
  }

  ionViewDidLoad() {
    this.doReset('Categorias');
    this.load();
  }

  load() {
    var self = this;
    this.util.presentLoading('Buscando...');

    self.dataService.findAll({
      controller: 'categories',
      query: { parentId: 0 }
    }).then((categories: Array<ICategory>) => {
      self.categories = categories;
      self.rows = Array.from(Array(Math.ceil(self.categories.length / 2)).keys());
      self.changeViewState();
    });
  }

  changeViewState() {
    if (_.size(this.categories) > 0) {
      this.doChangeView(ViewStatusEnum.Full);
    }
    else {
      this.doChangeView(ViewStatusEnum.Empty);
    }
    this.util.dismissLoading();
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
