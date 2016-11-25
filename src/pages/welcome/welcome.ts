import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
//import {Observable} from 'rxjs/Observable';
//import 'rxjs/add/observable/fromEvent';

import { ConnectivityService } from '../../providers/services/connectivity.service';
import { AuthService } from '../../providers/services/auth.service';
import { DataService } from '../../providers/services/data.service';
import { LoadingService } from '../../providers/services/loading.service';

import { SignTabsPage } from '../sign-tabs/sign-tabs';
import { HomeTabsPage } from '../home-tabs/home-tabs';
import { ModelPage } from '../model-page';

import { ViewStatusEnum } from '../../providers/enums';
//import { ICategory } from '../../providers/interfaces';
//import _ from 'underscore';

@Component({
  templateUrl: 'welcome.html'
})
export class WelcomePage extends ModelPage implements OnInit {
  /*private categories$: any;
  private dates$: any;
  private actions$: any;
  private user$: any;*/

  constructor(
    navParams: NavParams,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public dataService: DataService,
    public loading: LoadingService,
    public connService: ConnectivityService,
    public auth: AuthService
  ) {
    super('OndeTem?!', dataService, loading);
    console.log('WelcomePage');
    this.doToggleLoading(false);
  }

  ngOnInit() {
    this.load();
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

  load() {
    if(!this.connService.isOnline()) {
      this.retryConnection();
      return;
    }

    this.doToggleLoading(true);
    /*var source = Observable.combineLatest(
      this.dataService.categories$,
      this.dataService.actions$,
      this.dataService.dates$,
      function (s1, s2, s3) { return (_.size(s1) > 0) && (_.size(s2) > 0) && (_.size(s3) > 0) }
    )
    .distinctUntilChanged()
    .startWith(false);*/
    //this.dataService.loadMinimum();

    //this.categories$ = this.dataService.categories$;
    /*var self = this;
    source.subscribe(
      function(x) {
        self.loaded = x;
        self.changeViewState();
      },
      err => console.log(err)
    );*/
    this.loaded();
  }

  loaded() {
    this.doToggleLoading(false);
  }

  retryConnection() {
    console.log('Offline');
  }

  checkConnection() {
    // watch network for a disconnect
    /*let disconnectSubscription = Network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-( ');
      // UNKNOWN
      // NONE
      let alert = this.alertCtrl.create({
        title: "Connection",
        message: "You are offline!"
      });
      alert.present();
    });

    let connectSubscription = Network.onConnect().subscribe(() => {
      console.log('network connected!');    
      console.log(Network.connection);
      // We just got a connection but we need to wait briefly
        // before we determine the connection type.  Might need to wait    
      // prior to doing any api requests as well.
      if (Network.connection === 'wifi') {
        console.log('we got a wifi connection, woohoo!');
      }
      
      let alert = this.alertCtrl.create({
        title: "Connection",
        message: "You are online!"
      });
      alert.present();
    });*/
  }

  openPage(page) {
    // navigate to the new page if it is not the current page
    this.navCtrl.setRoot(page);
  }

  doRefreshOld() {
    /*this.dataService.clearCache("category");
    this.dataService.getCategories({parent: 0}, {sort: {id: 1}})
      .subscribe((categories: ICategory[]) => {
        this.data.categories = categories;
        this.changeViewState();
        refresher.complete();
      });*/
  }
}
