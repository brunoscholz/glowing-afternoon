import { Component, ViewChild, AfterViewInit, ElementRef, NgZone } from '@angular/core';
import { Platform, ViewController, AlertController, ModalController } from 'ionic-angular';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { MapService } from '../../providers/map/map.service';
import { GeocoderService } from '../../providers/map/geocoder.service';
import { Vibration } from 'ionic-native';

import { ISeller } from '../../providers/data/interfaces';

@Component({
  templateUrl: 'address.html',
})
export class SetAddressModal implements AfterViewInit {
  @ViewChild('searchbar', {read: ElementRef}) searchbar: ElementRef;
  autocompleteItems;
  autocomplete;
  private addressElement: HTMLInputElement = null;
  
  private localized: boolean = false;
  address;

  constructor(public platform: Platform,
              public viewCtrl: ViewController,
              private zone: NgZone,
              private mapService: MapService,
              private dataService: DataService,
              private geocoderService: GeocoderService,
              private util: UtilProvider,
              protected modCtrl: ModalController,
              protected alertCtrl: AlertController)
  {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };

    this.address = {
      place: ''
    };
  }

  ngAfterViewInit() {
    
  }

  onMapReady(): Promise<any> {
    console.log('onMapReady');
    let self = this;
    return self.platform.ready().then(() => {
      return self.locate().then(() => {
      const mapElement: Element = self.mapService.mapElement;
      if (mapElement) {
        setTimeout(() => {
          mapElement.classList.add('show-map');
          self.mapService.resizeMap();
          self.initAutocomplete();
          self.addressElement.focus();
        });
      }
      });
    });
  }

  onMapIdle() {
    if (!this.localized) return;
    const position = this.mapService.mapCenter;
    //console.log(position);
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
    self.util.presentLoading('Aguarde...');
    return self.mapService.setPosition()
    .then(() => {
      self.localized = true;
      // Vibrate the device for a second
      Vibration.vibrate(1000);
    }).catch(error => {
      self.alertNoGps();
      console.warn(error);
    }).then(() => {
      setTimeout(() => {
        self.util.dismissLoading();
      }, 1000);
    });
  }

  private alertNoGps() {
    const alert = this.alertCtrl.create({
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
    alert.present();
  }

  private initAutocomplete(): void {
    // reference : https://github.com/driftyco/ionic/issues/7223
    this.addressElement = this.searchbar.nativeElement.querySelector('.searchbar-input');
    this.mapService.createAutocomplete(this.addressElement).subscribe((location) => {
      this.dismiss(location);
    }, (error) => {
      //this.displayErrorAlert();
      console.error(error);
    });
  }

  confirmPosition() {
    const position = this.mapService.mapCenter;
    this.geocoderService.fullAddressForlatLng(position.lat(), position.lng())
    .subscribe((address: google.maps.GeocoderResult) => {
      this.viewCtrl.dismiss(address)
    }, (error) => {
      //this.displayErrorAlert();
      console.error(error);
    });
  }

  centerMe() {
    this.locate()
    .then(() => {});
  }  

  dismiss(location?: google.maps.LatLng) {
    console.log(location);
    if (this.addressElement) {
      this.addressElement.value = '';
    }
    if (location) {
      this.mapService.mapCenter = location;
    } else {
      this.viewCtrl.dismiss();
    }
  }

  /***
   * Place item has been selected
   */
  selectPlace(place: any) {
    //this.dismiss(place.geometry.location);
    let loc = new google.maps.LatLng(Number(place['latitude']), Number(place['longitude']));
    this.dismiss(loc);
  }

  chooseItem(item: any) {
    //this.viewCtrl.dismiss(item);
  }
}
