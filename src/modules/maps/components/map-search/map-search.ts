import { Component, ViewChild, AfterViewInit, ElementRef, NgZone } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { MapService } from '../../services/map.service';
import { AppService } from '../../../common/services/app.service';

import { ISeller } from '../../../common/models/interfaces';

@Component({
  templateUrl: 'map-search.html',
})
export class MapSearch implements AfterViewInit {
  @ViewChild('searchbar', {read: ElementRef}) searchbar: ElementRef;
  autocompleteItems;
  autocomplete;
  addressElement: HTMLInputElement = null;
  nearbyPlaces: Array<any> = [];

  constructor (
    public viewCtrl: ViewController,
    private zone: NgZone,
    private mapService: MapService,
    public theApp: AppService
  ) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initAutocomplete();
      this.getSellersNearby();
      this.addressElement.focus();
    });
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

  dismiss(location?: google.maps.LatLng) {
    //console.log(location);
    if (location) {
      this.mapService.mapCenter = location;
    }
    if (this.addressElement) {
      this.addressElement.value = '';
    }
    this.viewCtrl.dismiss();
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

  private getSellersNearby(): void {
    this.nearbyPlaces = [];
    /*this.dataService.findAll({
      controller: 'sellers',
      query: {}
    })
    .then((data: Array<ISeller>) => {
        let _places = [];

        for (var i = 0; i < data.length; ++i) {
          if(data[i].billingAddress.latitude == 0)
            continue;

          _places.push({
            icon: data[i].picture.thumbnail,
            name: data[i].name,
            vicinity: 'hola que tal!',
            distance: 0,
            title: data[i].name,
            latitude: data[i].billingAddress.latitude,
            longitude: data[i].billingAddress.longitude
          });
        }
        _places = this.mapService.applyHaversine(_places);
        _places.sort((locationA, locationB) => {
            return locationA.distance - locationB.distance;
        });

        return _places;
    })
    .then((_nearbyPlaces) => {
      this.zone.run(() => {
        this.nearbyPlaces.push.apply(this.nearbyPlaces, _nearbyPlaces);
      });
    });*/
  }

  /*private loadNearbyPlaces(): void {
    this.nearbyPlaces = [];
    this.mapService.loadNearbyPlaces().subscribe((_nearbyPlaces) => {
      // force NgZone to detect changes
      this.zone.run(() => {
        this.nearbyPlaces.push.apply(this.nearbyPlaces, _nearbyPlaces);
      });
    }, (error) => {
      //this.displayErrorAlert();
      console.error(error);
    });
  }*/
}
