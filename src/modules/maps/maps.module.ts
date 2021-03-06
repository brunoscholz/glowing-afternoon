import { NgModule } from '@angular/core';
import { Platform, Events, ModalController } from 'ionic-angular';
import { CommonModule } from '../common/common.module';

import { AppService } from '../common/services/app.service';
//import { UserService } from '../user/services/user.service';

import { Geolocation } from '@ionic-native/geolocation';
import { MapService } from './services/map.service';
import { GeocoderService } from './services/geocoder.service';

import { MapPage } from './pages/map/map';
import { SellerMapPage } from './pages/seller-map/map-page';

import { MapCmp } from './components/map/map';
import { MapSearch } from './components/map-search/map-search';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    MapCmp,
    MapPage,
    SellerMapPage,
  ],
  entryComponents: [
    MapPage,
    SellerMapPage,
  ],
  providers: [
    Geolocation,
    MapService,
    GeocoderService,
  ],
  exports: [
    MapCmp,
  ],
})

export class MapsModule {
  constructor(
    public platform: Platform,
    public events: Events,
    public theApp: AppService,
    public mapService: MapService,
    public modalCtrl: ModalController
  ) {
    // load translations
    //this.theApp.loadTranslations(UserTranslations);

    // subcribe events
    this.subscribeEvents();

    // platform ready
    this.platform.ready().then(() => {
      // get user
      //this.getUser();
      this.mapService.init();
    });
  }

  //
  // Subscribe events
  subscribeEvents() {
    
  }
}