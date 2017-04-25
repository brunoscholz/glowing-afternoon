/**
 * CompanyPage class
 *
 * List of all companies
*/

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { CompanyDetailPage } from '../company-detail/company-detail';

import { AppService } from '../../modules/common/services/app.service';
import { DataService } from '../../modules/common/services/data.service';

import { ViewStatusEnum } from '../../modules/common/models/enums';
import { IUser, IProfile, IBalance } from '../../modules/common/models/interfaces';
import { ModelPage } from '../../modules/common/models/model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'company.html'
})
export class CompanyPage extends ModelPage {
  companies: any = [];

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public dataService: DataService,
    public theApp: AppService
  ) {
    super('Empresas');
    this.selectedItem = navParams.get('item');
  }

  ionViewWillEnter() {
    this.doReset('Empresas');
    this.load();
  }

  load() {
    var self = this;
    this.doChangeView(ViewStatusEnum.Empty);
    this.theApp.util.presentLoading('Buscando...');

    this.dataService.findAll({
      controller: 'sellers',
      query: { }
    }).then((companies: Array<ISeller>) => {
      self.companies = companies;
      self.changeViewState(true);
      if(self.refresher)
        self.refresher.complete();
    }, (err) => {
      console.log(err);
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

  // changeDisplayMode(mode: DisplayModeEnum) {
  //   this.displayMode = mode;
  // }

  itemTapped(event, item) {
    this.navCtrl.push(CompanyDetailPage, {
      item: item
    });
  }

}
