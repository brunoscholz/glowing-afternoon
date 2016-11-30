/**
 * CompanyPage class
 *
 * List of all companies
 * 
 *
*/

import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CompanyDetailPage } from '../company-detail/company-detail';
import { DataService } from '../../providers/data/data.service';
import { LoadingService } from '../../providers/utils/loading.service';

import { ViewStatusEnum } from '../../providers/utils/enums';
import { ModelPage } from '../model-page';

import { ISeller } from '../../providers/data/interfaces';

import _ from 'underscore';

@Component({
  templateUrl: 'company.html'
})
export class CompanyPage extends ModelPage implements OnInit {
  companies: any = [];

  constructor(public navCtrl: NavController, navParams: NavParams, public dataService: DataService, public loading: LoadingService) {
    super('Empresas', dataService, loading);
    this.selectedItem = navParams.get('item');
  }

  ngOnInit() {
    var self = this;
    self.dataService.sellers$.subscribe((companies: ISeller) => {
        self.companies = companies;
        self.changeViewState();
        if(self.refresher)
          self.refresher.complete();
      });
  }

  ionViewWillEnter() {
    this.doReset('Empresas');
    this.load();
  }

  changeViewState() {
    if (_.size(this.companies) > 0) {
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
    this.dataService.findAll({ controller: 'sellers', query: { } } );
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
