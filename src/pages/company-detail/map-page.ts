import { Component, NgZone } from '@angular/core';
import { Platform, NavParams, ViewController } from 'ionic-angular';
import { MapService } from '../../providers/map/map.service';
import { GeocoderService } from '../../providers/map/geocoder.service';
//import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { ISeller } from '../../providers/data/interfaces';

@Component({
  templateUrl: 'map-page.html',
})
export class SellerMapPage {
  private localized: boolean = false;
  address;
  company: ISeller;
  companyPosition: google.maps.LatLng;

  constructor(private platform: Platform,
              public viewCtrl: ViewController,
              navParams: NavParams,
              private zone: NgZone,
              private mapService: MapService,
              private geocoderService: GeocoderService,
              public util: UtilProvider)
  {
    this.company = navParams.get('company') || {};
  }

  dismiss() {
    this.viewCtrl.dismiss();
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
          self.mapService.addMarker(self.companyPosition, self.company.picture.thumbnail); // 'assets/img/spotlight-poi_hdpi.png'
        }
      });
    });
  }

  onMapIdle() {
    /*if (!this.localized) return;
    const position = this.mapService.mapCenter;*/
    /*console.log(position);
    this.geocoderService.addressForlatLng(position.lat(), position.lng())
      .subscribe((address: string) => {

        const content = `<div padding><strong>${address}</strong></div>`;
        this.mapService.createInfoWindow(content, position);

      }, (error) => {
        //this.displayErrorAlert();
        console.error(error);
      });*/
  }

  onDragStart() {
    this.mapService.closeInfoWindow();
  }

  /**
   * Get the seller position
   */
  private locate(): Promise<any> {
    let self = this;
    let promise = new Promise((resolve, reject) => {
      self.util.presentLoading('Aguarde...');
      self.companyPosition = new google.maps.LatLng(Number(self.company.billingAddress['latitude']), Number(self.company.billingAddress['longitude']));
      self.mapService.mapCenter = self.companyPosition;
      setTimeout(() => {
        self.util.dismissLoading();
        self.localized = true;
        resolve(true);
      }, 1000);
    });
    return promise;
  }

  goThere() {
    this.mapService.addMarker(this.mapService.devPosition, 'assets/img/spotlight-poi_hdpi.png');
    this.mapService.getRoute(this.companyPosition);
  }

  centerMe() {
    this.locate()
    .then(() => {});
  }
}
