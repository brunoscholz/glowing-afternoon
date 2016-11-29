import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import { DataService } from '../../providers/services/data.service';
import { LoadingService } from '../../providers/services/loading.service';
import { ViewStatusEnum } from '../../providers/enums';
//import { ElasticHeader } from '../../directives/elastic-header';

import { IBuyer } from '../../providers/interfaces';

import { ModelPage } from '../model-page';
import _ from 'underscore';

@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage extends ModelPage implements OnInit {
  user: IBuyer = null;
  balance: any = null;
  loginInfo: any;
	bgImage: string;
	rows: any;

  constructor(public navCtrl: NavController, navParams: NavParams, public sanitizer: DomSanitizer, public dataService: DataService, public loading: LoadingService) {
  	super('Perfil', dataService, loading);
  }

  ngOnInit() {
    var self = this;
    self.dataService.loggedUser$.subscribe((users: IBuyer) => {
      self.user = users;
      self.prepareUser();
      this.loadBalance();
      this.doChangeTitle(this.user.name);
    });

    self.dataService.balance$.subscribe((loyal) => {
      self.balance = loyal;
      console.log(loyal);
      self.changeViewState();
      if(self.refresher)
        self.refresher.complete();
    });
  }

  ionViewWillEnter() {
    this.doReset("Perfil");
    this.load();
  }

  changeViewState() {
    if (_.size(this.user) > 0) {
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

  load() {
    this.dataService.fetchUser({});
  }

  loadBalance () {
    this.dataService.findAll({
      controller: 'loyalty',
      query: { 'buyer.buyerId': { test: "like binary", value: this.user.buyerId } }
    });
  }

  prepareUser() {
    //console.log(this.user);
    //this.bgImage = this.sanitizer.bypassSecurityTrustUrl(this.user.picture.large);
    this.bgImage = 'http://ondetem.tk/' + this.user.picture.cover;
    this.rows = Array.from(Array(Math.ceil(this.user.reviews.length / 2)).keys());
  }

  hasField(field: any) {
    if (_.size(field) > 0)
      return true;

    return false;
  }
}
