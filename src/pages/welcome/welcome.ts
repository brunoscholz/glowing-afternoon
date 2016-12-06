import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import {Observable} from 'rxjs/Observable';
//import 'rxjs/add/observable/fromEvent';

import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { ConnectivityService } from '../../providers/utils/connectivity.service';

import { ModelPage } from '../model-page';

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
    public dataService: DataService,
    public connService: ConnectivityService,
    public auth: AuthService,
    public util: UtilProvider
  ) {
    super('OndeTem?!', dataService, util);
    console.log('WelcomePage');
  }

  ngOnInit() {
    this.load();
  }

  ionViewWillEnter() {
    this.doReset('OndeTem?!');
  }

  changeViewState() {
    //this.util.dismissLoading();
  }

  doRefresh(refresher) {
    //this.refresher = refresher;
    //this.load();
  }

  load() {
    var self = this;
    //this.util.presentLoading('Carregando...');
    
    if(!self.connService.isOnline()) {
      self.retryConnection(false);
      return;
    }

    self.dataService.findAll({
      controller: 'categories',
      query: { parentId: 0 }
    }).then((cats) => {
      self.loaded();
    });

    /*var source = Observable.combineLatest(
      this.dataService.categories$,
      this.dataService.user$,
      function (s1, s2) { return (_.size(s1) > 0) && (_.size(s2) > 0) }
    )
    .distinctUntilChanged()
    .startWith(false);*/
    //this.dataService.loadMinimum();
  }

  loaded() {
    //this.util.dismissLoading();
  }

  retryConnection(pass = false) {
    // setTimeout({}, 2000);
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
}
