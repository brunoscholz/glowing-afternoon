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
    return self.platform.ready()
    .then(() => {
      return self.locate()
      .then(() => {
        const mapElement: Element = self.mapService.mapElement;
        if (mapElement) {
          console.log(self.companyPosition);
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

  goThereOld() {
    //this.mapService.addMarker(this.mapService.devPosition, 'assets/img/spotlight-poi_hdpi.png');
    let marker = {
      url: 'assets/img/spotlight-poi_hdpi.png',
      size: new google.maps.Size(256, 256),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(11, 20),
      scaledSize: new google.maps.Size(22, 40)
    };
    this.mapService.addMarker(this.mapService.devPosition, 'assets/img/spotlight-poi_hdpi.png', marker);
    this.mapService.getRoute(this.companyPosition);
  }

  goThere() {
    if (this.companyPosition) {
      // ios
      if (this.platform.is('ios')) {
        window.open('maps://?q=' + this.company.name + '&saddr=' + this.companyPosition.lat + ',' + this.companyPosition.lng + '&daddr=' + this.company.billingAddress['latitude'] + ',' + this.company.billingAddress['longitude'], '_system');
      };
      // android
      if (this.platform.is('android')) {
        window.open('geo://' + this.companyPosition.lat + ',' + this.companyPosition.lng + '?q=' + this.company.billingAddress['latitude'] + ',' + this.company.billingAddress['longitude'] + '(' + this.company.name + ')', '_system');
      };
    }
  }

  centerMe() {
    this.locate()
    .then(() => {});
  }
}
