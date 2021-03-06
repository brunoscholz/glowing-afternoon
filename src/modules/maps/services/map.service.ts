/**
 * @author    Damien Dell'Amico <damien.dellamico@gmail.com>
 * @copyright Copyright (c) 2016
 * @license   GPL-3.0
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Geolocation } from '@ionic-native/geolocation';
import { MapConst } from '../models/map.constants';
import { ConnectivityService } from '../../common/services/connectivity.service';
import { Data } from '../../common/models/data.model';

import { ISeller } from '../../common/models/interfaces';

declare var google: any;

interface IMapOptions {
  lat: number;
  lon: number;
  zoom: number;
}

@Injectable()
export class MapService {

  private map: google.maps.Map = null;
  private infoWindow: google.maps.InfoWindow = null;
  private apiKey: string = "AIzaSyDE-9XwfZIu0eNCJoxmEizYlREkCHrj7_4";
  private markers: any = [];
  mapInitialised: boolean = false;
  currentPosition: Data = null;
  devPosition: google.maps.LatLng;

  constructor(
    public conn: ConnectivityService,
    public geolocation: Geolocation
  ) {  
  }

  init() {
    this.loadGoogleBackground();
    this.currentPosition = new Data();
  }

  initMap() {
    console.log('Init MAP');
    this.mapInitialised = true;

    this.getCurrentPosition()
      .then((position) => {
        this.devPosition = new google.maps.LatLng(position.latitude, position.longitude);
      });
  }

  /***
   * get the current location using Geolocation cordova plugin
   * @param maximumAge
   * @returns {Promise<Coordinates>}
   */
  public getCurrentPosition(maximumAge: number = 10000): Promise<Coordinates> {
    let self = this;

    let promise = new Promise<Coordinates>((resolve, reject) => {
      if(self.currentPosition == null)
        self.currentPosition = new Data();

      if(!self.currentPosition.isUpToDate()) {
        resolve(<Coordinates>self.currentPosition.value);
      }
      else {
        const options = {
          timeout: 10000,
          enableHighAccuracy: true
        };
        this.geolocation.getCurrentPosition(options)
        .then((pos) => {
          self.currentPosition.set(pos.coords);
          resolve(pos.coords);
        }, (err) => {
          reject(new Error('Something terrible happened.'));
        });
      }
    });
    return promise;
  }

  public startExternalMap() {
    /*if (this.location.latitude) {
      this.platform.ready().then(() => {
        Geolocation.getCurrentPosition().then((position) => {
          // ios
          if (this.platform.is('ios')) {
            window.open('maps://?q=' + this.location.name + '&saddr=' + position.coords.latitude + ',' + position.coords.longitude + '&daddr=' + this.location.latitude + ',' + this.location.longitude, '_system');
          };
          // android
          if (this.platform.is('android')) {
            window.open('geo://' + position.coords.latitude + ',' + position.coords.longitude + '?q=' + this.location.latitude + ',' + this.location.longitude + '(' + this.location.name + ')', '_system');
          };
        });
      });
    };*/
  }

  public createMap(mapEl: Element, opts = {
    lat: MapConst.DEFAULT_LAT,
    lon: MapConst.DEFAULT_LNG,
    zoom: MapConst.MIN_ZOOM
  }): Promise<google.maps.Map> {

    return this.loadMap().then(() => {
      const myLatLng = new google.maps.LatLng(opts.lat, opts.lon);
      const styleArray = [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#1d2c4d"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8ec3b9"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1a3646"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#4b6878"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#64779e"
            }
          ]
        },
        {
          "featureType": "administrative.province",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#4b6878"
            }
          ]
        },
        {
          "featureType": "landscape.man_made",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#334e87"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#023e58"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#283d6a"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#6f9ba5"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1d2c4d"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#023e58"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#3C7680"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#304a7d"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#98a5be"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1d2c4d"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#2c6675"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#255763"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#b0d5ce"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#023e58"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#98a5be"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1d2c4d"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#283d6a"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#3a4762"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#0e1626"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#4e6d70"
            }
          ]
        }
      ];

      //[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":20},{"color":"#ececec"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"on"},{"color":"#f0f0ef"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#f0f0ef"}]},{"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#d4d4d4"}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"on"},{"color":"#ececec"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21},{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#d4d4d4"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#303030"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"saturation":"-100"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.government","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"featureType":"poi.place_of_worship","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.school","elementType":"geometry.stroke","stylers":[{"lightness":"-61"},{"gamma":"0.00"},{"visibility":"off"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#dadada"},{"lightness":17}]}]
      const mapOptions: google.maps.MapOptions = {
        backgroundColor: 'white',
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: opts.zoom,
        minZoom: opts.zoom,
        center: myLatLng,
        disableDefaultUI: true,
        scaleControl: false,
        zoomControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_CENTER
        },
        styles: styleArray
      };

      this.map = new google.maps.Map(mapEl, mapOptions);
      //this.map = new google.maps.Map(document.querySelector('#map'), mapOptions);
      //this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
      
      return this.map;
    });
  }

  /**
   * return the coordinates of the center of map
   * @returns {LatLng}
   */
  public get mapCenter(): google.maps.LatLng {
    return this.map.getCenter();
  }

  public set mapCenter(location: google.maps.LatLng) {
    this.map.setCenter(location);
    this.map.setZoom(MapConst.DEFAULT_ZOOM);
  }

  /***
   * return map html element
   * @returns {Element}
   */
  public get mapElement(): Element {
    return this.map.getDiv();
  }

  /***
   * create an infoWindow and display it in the map
   * @param content - the content to display inside the infoWindow
   * @param position
   */
  public createInfoWindow(content: string, position: google.maps.LatLng): void {
    this.closeInfoWindow();
    const opt: google.maps.InfoWindowOptions = {
      content,
      position,
      pixelOffset: new google.maps.Size(0, -50),
      disableAutoPan: true
    };
    this.infoWindow = new google.maps.InfoWindow(opt);
    setTimeout(() => this.infoWindow.open(this.map), 100);
  }

  /***
   * close the current infoWindow
   */
  public closeInfoWindow(): void {
    if (this.infoWindow) {
      this.infoWindow.close();
    }
  }

  /***
   * create Place Autocomplete
   * ref: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
   * @param addressEl
   * @returns {Observable}
   */
  public createAutocomplete(addressEl: HTMLInputElement): Observable<any> {
    const autocomplete = new google.maps.places.Autocomplete(addressEl);
    autocomplete.bindTo('bounds', this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: 'Autocomplete returned place with no geometry'
          });
        } else {
          sub.next(place.geometry.location);
          sub.complete();
        }
      });
    });
  }

  public getPlacePredictions(opt) {
    const serviceAP = new google.maps.places.AutocompleteService();
    return serviceAP.getPlacePredictions(opt);
  }

  /***
   * set map position and the relative center and zoom
   * @returns {Promise<google.maps.LatLng>}
   */
  public setPosition(): Promise<google.maps.LatLng> {
    return this.getCurrentPosition().then((coords: Coordinates) => {
      if (!coords) {
        console.warn('invalid coordinates: ', coords);
        return null;
      }
      const myLatLng = new google.maps.LatLng(coords.latitude, coords.longitude);
      this.map.setCenter(myLatLng);
      this.map.setZoom(MapConst.MAX_ZOOM);
      return this.mapCenter;
    });
  }

  public pickPlace(place) {
    console.log(place['latitude']);
  }

  public getPosition(): Promise<Coordinates> {
    return this.getCurrentPosition();
  }

  public addMarker(latLng: google.maps.LatLng,  icon: string, custom = null): void {
    
    let customMarker = custom || {
      url: icon,
      size: new google.maps.Size(256, 256),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(15, 15),
      scaledSize: new google.maps.Size(30, 30)
    };
    //let latLng = new google.maps.LatLng(lat, lng);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      icon: customMarker
    });

    this.markers.push(marker);
  }

  /***
   * trigger map resize event
   */
  public resizeMap(): void {
    if (this.map) {
      google.maps.event.trigger(this.map, 'resize');
    }
  }

  public getRoute(latLng: google.maps.LatLng) {
    let self = this;
    const directionsService = new google.maps.DirectionsService;
    const directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true
    });
    directionsDisplay.setMap(this.map);
    directionsService.route({
      origin: this.devPosition,
      destination: latLng,
      waypoints: [],
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        self.map.setZoom(MapConst.MIN_ZOOM);

        /*if (self.platform.is('ios')) {
          window.open('maps://?q=' + this.location.name + '&saddr=' + position.coords.latitude + ',' + position.coords.longitude + '&daddr=' + this.location.latitude + ',' + this.location.longitude, '_system');
        };
        // android
        if (self.platform.is('android')) {
          window.open('geo://' + position.coords.latitude + ',' + position.coords.longitude + '?q=' + this.location.latitude + ',' + this.location.longitude + '(' + this.location.name + ')', '_system');
        };*/
      } else {
        console.log('Could not display directions due to: ' + status);
      }
    });
  }

  /***
   * google map place searches
   * @returns {Observable}
   */
  public loadNearbyPlaces(): Observable<any> {
    const position: google.maps.LatLng = this.mapCenter;

    const placesService = new google.maps.places.PlacesService(this.map);
    const request: google.maps.places.PlaceSearchRequest = {
      location: position,
      radius: 500
    };

    return new Observable((sub: any) => {
      placesService.nearbySearch(request, (results, status) => {
        const _nearbyPlaces = [];
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            const place: any = results[i];
            const distance: number =
              google.maps.geometry.spherical.computeDistanceBetween(position, place.geometry.location);
            place.distance = distance.toFixed(2);
            _nearbyPlaces.push(place);
          }
          sub.next(_nearbyPlaces);
          sub.complete();
        } else {
          sub.error({
            message: 'Invalid response status from nearbySearch : ${status}'
          });
        }
      });
    });
  }

  /***
   * Load Google Map Api in async mode
   * @returns {Promise}
   */
  private loadMap(): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      if ((<any>window).google && (<any>window).google.maps) {
        resolve();
      } else {
        this.loadGoogleMapApi().then(() => resolve()).catch(reason => {
          reject(reason);
        });
      }
    });
  }

  /***
   * Create a script element to insert into the page
   * @returns {Promise}
   * @private
   */
  private loadGoogleMapApi(): Promise<any> {
    const _loadScript = () => {
      const script = document.createElement('script');
      script.id = "googleMaps";

      if(this.apiKey) {
        script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=initMap&libraries=geometry,places';
      } else {
        script.src = 'http://maps.google.com/maps/api/js?callback=initMap';       
      }
      //script.src = `https://maps.googleapis.com/maps/api/js?libraries=places,geometry&language=it&components=country:IT&callback=initMap`;
      script.type = 'text/javascript';
      script.async = true;
      const s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(script, s);
    };

    return new Promise((resolve: Function) => {
      (<any>window).initMap = () => {
        return resolve();
      };
      _loadScript();
      this.initMap();
    });
  }

  loadGoogleBackground() {
    this.addConnectivityListeners();
    if(typeof google == "undefined" || typeof google.maps == "undefined") {
      console.log("Google maps JavaScript needs to be loaded.");
      this.disableMap();

      if(this.conn.isOnline()) {
        console.log("online, loading map");
        this.loadGoogleMapApi()
        .then(() => {

        });
      }
    } else {
      if(this.conn.isOnline()) {
        this.initMap();
      }
    }
  }

  disableMap() {
    console.log("disable map");
  }
 
  enableMap() {
    console.log("enable map");
  }

  addConnectivityListeners(){
    let onOnline = () => {
      setTimeout(() => {
        if(typeof google == "undefined" || typeof google.maps == "undefined") {
          this.loadGoogleBackground();
        } else {
          if(!this.mapInitialised) {
            this.initMap();
          }
          this.enableMap();
        }
      }, 2000);
    };

    let onOffline = () => {
      this.disableMap();
    };

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);
  }

  applyHaversineSeller(locations: Array<ISeller>, usersLocation) {
    locations.map((location) => {
      let placeLocation = {
        lat: location.billingAddress.latitude,
        lng: location.billingAddress.longitude
      };

      location.distance = this.getDistanceBetweenPoints(
        usersLocation,
        placeLocation,
        'km'
      );
    });

    return locations;
  }

  applyHaversine(locations, usersLocation = {lat: -25.4289541, lng: -49.267137}) {
 
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
 
    getDistanceBetweenPoints(start, end, units): number {
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