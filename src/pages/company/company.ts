/**
 * CompanyPage class
 *
 * List of all companies
 * 
 *
*/

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CompanyDetailPage } from '../company-detail/company-detail';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { ViewStatusEnum } from '../../providers/utils/enums';
import { ModelPage } from '../model-page';

import { ISeller } from '../../providers/data/interfaces';

import _ from 'underscore';

@Component({
  templateUrl: 'company.html'
})
export class CompanyPage extends ModelPage {
  companies: any = [];

  constructor(public navCtrl: NavController,
              navParams: NavParams,
              public dataService: DataService,
              public util: UtilProvider
  ) {
    super('Empresas', dataService, util);
    this.selectedItem = navParams.get('item');
  }

  ionViewWillEnter() {
    this.doReset('Empresas');
    this.load();
  }

  load() {
    var self = this;
    this.doChangeView(ViewStatusEnum.Empty);
    this.util.presentLoading('Buscando...');

    this.dataService.findAll({
      controller: 'sellers',
      query: { }
    }).then((companies: Array<ISeller>) => {
      self.companies = companies;
      self.changeViewState();
      if(self.refresher)
        self.refresher.complete();
    }, (err) => {
      console.log(err);
    });
  }

  changeViewState() {
    if (_.size(this.companies) > 0) {
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

  // changeDisplayMode(mode: DisplayModeEnum) {
  //   this.displayMode = mode;
  // }

  itemTapped(event, item) {
    this.navCtrl.push(CompanyDetailPage, {
      item: item
    });
  }

}
