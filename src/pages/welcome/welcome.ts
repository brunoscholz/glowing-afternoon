import { Component, OnInit } from '@angular/core';
import { Nav, NavParams, AlertController } from 'ionic-angular';
//import { Network } from 'ionic-native';

//import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

import { DataService } from '../../providers/services/data.service';
import { LoadingService } from '../../providers/services/loading.service';

// import { SignTabsPage } from '../../pages/sign-tabs/sign-tabs';
// import { HomeTabsPage } from '../../pages/home-tabs/home-tabs';
import { HomePage } from '../home/home';

import { ViewStatusEnum } from '../../providers/enums';
//import { ICategory } from '../../providers/interfaces';
//import _ from 'underscore';

@Component({
  templateUrl: 'welcome.html',
})
export class WelcomePage implements OnInit {
  title: string;
  viewStatusEnum = ViewStatusEnum;
  status = ViewStatusEnum.Loading;
  connected: Boolean = false;
  loaded: Boolean = false;

  /*private categories$: any;
  private dates$: any;
  private actions$: any;
  private user$: any;*/

  constructor(public navCtrl: Nav, navParams: NavParams, public alertCtrl: AlertController, public dataService: DataService, public loading: LoadingService) {
    console.log('WelcomePage');
    // check connection...
    // check if logged in
  }

  ngOnInit() {
    this.reset();
    //this.checkConnection();
    this.load();
  }

  load() {
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

    setTimeout(() => {
      this.navCtrl.setRoot(HomePage);
    }, 5000);
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

  reset() {
    this.title = 'OndeTem?!';
    this.status = ViewStatusEnum.Loading;
    this.loading.toggleLoadingIndicator(true);
  }

  changeView(st: ViewStatusEnum) {
    this.status = st;
  }

  changeViewState() {
    /*this.loading.toggleLoadingIndicator(!this.loaded);
    if (this.loaded) {
      this.changeView(ViewStatusEnum.Empty);
      this.openPage(SignTabsPage);
    }*/
  }

  openPage(page) {
    // navigate to the new page if it is not the current page
    this.navCtrl.setRoot(page);
  }

  doRefresh() {
    /*this.dataService.clearCache("category");
    this.dataService.getCategories({parent: 0}, {sort: {id: 1}})
      .subscribe((categories: ICategory[]) => {
        this.data.categories = categories;
        this.changeViewState();
        refresher.complete();
      });*/
  }
}
