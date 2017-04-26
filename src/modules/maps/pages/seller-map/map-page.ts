import { Component, NgZone } from '@angular/core';
import { Platform, NavParams, ViewController } from 'ionic-angular';

import { MapService } from '../../services/map.service';
import { GeocoderService } from '../../services/geocoder.service';
import { AppService } from '../../../common/services/app.service';

//import { ViewStatusEnum } from '../../../common/models/enums';
import { ISeller } from '../../../common/models/interfaces';

@Component({
  templateUrl: 'map-page.html',
})
export class SellerMapPage {
  private localized: boolean = false;
  address;
  company: ISeller;
  companyPosition: google.maps.LatLng;

  constructor(
    private platform: Platform,
    public viewCtrl: ViewController,
    navParams: NavParams,
    private zone: NgZone,
    private mapService: MapService,
    private geocoderService: GeocoderService,
    public theApp: AppService
  ) {
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
      self.theApp.util.presentLoading('Aguarde...');
      self.companyPosition = new google.maps.LatLng(Number(self.company.billingAddress['latitude']), Number(self.company.billingAddress['longitude']));
      self.mapService.mapCenter = self.companyPosition;
      setTimeout(() => {
        self.theApp.util.dismissLoading();
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
