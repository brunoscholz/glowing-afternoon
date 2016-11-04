import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import { DataService } from '../../providers/services/data.service';
import { LoadingService } from '../../providers/services/loading.service';
import { LoadingModal } from '../../components/loading-modal/loading-modal';
import { ViewStatusEnum } from '../../providers/enums';
import { ElasticHeader } from '../../directives/elastic-header';

import { IUser } from '../../providers/interfaces';

import { ModelPage } from '../model-page';
import _ from 'underscore';

@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage extends ModelPage implements OnInit {
  user: IUser = null;
	reviews: any = [];
	backimg: any;
	rows: any;

  constructor(public navCtrl: NavController, navParams: NavParams, public sanitizer: DomSanitizer, public dataService: DataService, public loading: LoadingService) {
  	super('Profile', dataService, loading);
  }

  ngOnInit() {
    var self = this;
    self.dataService.users$.subscribe((users: IUser) => {
      self.user = users;
      self.prepareUser();
      self.changeViewState();
      if(self.refresher)
        self.refresher.complete();
    });
  }

  ionViewWillEnter() {
    this.doReset('Profile');
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
    //this.refresher = refresher;
    this.load();
  }

  load() {
    this.doToggleLoading(true);
    this.dataService.getDemoUser();
  }

  prepareUser() {
    //this.backimg = sanitizer.bypassSecurityTrustUrl('assets/img/card-saopaolo.png');
    console.log(this.user);
    this.backimg = this.sanitizer.bypassSecurityTrustUrl(this.user.picture.large);
    this.rows = Array.from(Array(Math.ceil(this.reviews.length / 2)).keys());
  }

}
