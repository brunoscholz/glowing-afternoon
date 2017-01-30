import { Component, ViewChild, AfterViewInit, ElementRef, NgZone } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { MapService } from '../../providers/map/map.service';
import { DataService } from '../../providers/data/data.service';

import { ISeller } from '../../providers/data/interfaces';

@Component({
  templateUrl: 'map-search.html',
})
export class MapSearch implements AfterViewInit {
  @ViewChild('searchbar', {read: ElementRef}) searchbar: ElementRef;
  autocompleteItems;
  autocomplete;
  private addressElement: HTMLInputElement = null;
  private nearbyPlaces: Array<any> = [];

  constructor (public viewCtrl: ViewController,
               private zone: NgZone,
               private mapService: MapService,
               private dataService: DataService,)
  {
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
    this.dataService.findAll({
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
        _places = this.applyHaversine(_places);
        _places.sort((locationA, locationB) => {
            return locationA.distance - locationB.distance;
        });

        return _places;
    })
    .then((_nearbyPlaces) => {
      this.zone.run(() => {
        this.nearbyPlaces.push.apply(this.nearbyPlaces, _nearbyPlaces);
      });
    });
  }

  private loadNearbyPlaces(): void {
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
  }

  applyHaversine(locations) {
    let usersLocation = {
      lat: -25.4289541, 
      lng: -49.267137
    };
 
    locations.map((location) => {
      let placeLocation = {
        lat: location.latitude,
        lng: location.longitude
      };

      location.distance = this.getDistanceBetweenPoints(
        usersLocation,
        placeLocation,
        'km'
      ).toFixed(2);
    });
 
        return locations;
    }
 
    getDistanceBetweenPoints(start, end, units) {
      let earthRadius = {
        miles: 3958.8,
        km: 6371
      };

      let R = earthRadius[units || 'miles'];
      let lat1 = start.lat;
      let lon1 = start.lng;
      let lat2 = end.lat;
      let lon2 = end.lng;

      let dLat = this.toRad((lat2 - lat1));
      let dLon = this.toRad((lon2 - lon1));
      let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;

      return d;
    }

    toRad(x){
      return x * Math.PI / 180;
    }
}
