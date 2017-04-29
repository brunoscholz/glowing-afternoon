import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AppService } from '../../modules/common/services/app.service';
import { OfferService } from '../../modules/offer/services/offer.service';

import { ModelPage } from '../../modules/common/pages/model-page';

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
    public theApp: AppService,
    public offerService: OfferService
  ) {
    super('Onde tem?');
    console.log('WelcomePage');
  }

  ngOnInit() {
    this.load();
  }

  ionViewWillEnter() {
    this.doReset('Onde tem?');
  }

  load() {
    var self = this;
    //self.theApp.util.presentLoading();
    self.offerService.getCategories({
      query: { parentId: 0 }
    })
    .then((res) => {
      self.loaded();
    });
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
