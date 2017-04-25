import { Component } from '@angular/core';
import { Platform, NavController, AlertController, ModalController } from 'ionic-angular';

//import { Vibration } from 'ionic-native';
import { GeocoderService } from '../services/geocoder.service';
import { MapService } from '../services/map.service';
//import { UtilProvider } from '../../providers/utils/util.provider';
import { AppService } from '../../common/services/app.service';

//import { MapSearch } from '../../components/map-search/map-search';

@Component({
  templateUrl: './map.html'
})
export class MapPage {
  localized: boolean = false;
  address;

  constructor(private platform: Platform,
              private nav: NavController,
              private geocoderService: GeocoderService,
              private mapService: MapService,
              private theApp: AppService
  ) {
    this.address = {
      place: ''
    };
  }

  onMapReady(): Promise<any> {
    console.log('onMapReady');
    let self = this;
    return self.platform.ready().then(() => {
      return self.locate().then(() => {
      const mapElement: Element = self.mapService.mapElement;
      if (mapElement) {
        mapElement.classList.add('show-map');
        self.mapService.resizeMap();
      }
      });
    });
  }

  onMapIdle() {
    if (!this.localized) return;
    const position = this.mapService.mapCenter;
    console.log(position);
    this.geocoderService.addressForlatLng(position.lat(), position.lng())
      .subscribe((address: string) => {

        const content = `<div padding><strong>${address}</strong></div>`;
        this.mapService.createInfoWindow(content, position);

      }, (error) => {
        //this.displayErrorAlert();
        console.error(error);
      });
  }

  onDragStart() {
    this.mapService.closeInfoWindow();
  }

  /**
   * Get the current position
   */
  private locate(): Promise<any> {
    let self = this;
    // begin load
    self.theApp.util.presentLoading();
    return self.mapService.setPosition()
    .then(() => {
      self.localized = true;
      // Vibrate the device for a second
      //Vibration.vibrate(1000);
    }).catch(error => {
      self.alertNoGps();
      console.warn(error);
    }).then(() => {
      setTimeout(() => {
        self.theApp.util.dismissLoading();
      }, 1000);
    });
  }

  private alertNoGps() {
    /*const alert = this.alertCtrl.create({
      title: 'Onde tem?',
      subTitle: 'Gps e localização da rede não disponíveis. Clique OK para tentar novamente',
      enableBackdropDismiss: false,
      buttons: [{
        text: 'OK',
        handler: () => {
          setTimeout(() => this.locate(), 1500);
        }
      }]
    });
    alert.present();*/
  }

  confirmPosition() {

  }

  centerMe() {
    this.locate()
    .then(() => {});
  }

  openSearchModal() {
    /*let modal = this.modCtrl.create(MapSearch);
    modal.onDidDismiss(data => {
      this.address.place = data;
    });

    modal.present();*/
  }
}
