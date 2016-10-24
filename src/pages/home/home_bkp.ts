import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

//import { LocationTracker } from '../../providers/location-tracker';
import { Geolocation } from 'ionic-native';

import { CategoryPage } from '../category/category';
import { ProductPage } from '../product/product';

import { SearchPage } from '../search/search';

declare var google;

@Component({
	//selector: 'page-home',
	templateUrl: 'home.html',
	//providers: [LocationTracker]
})
export class HomePage {
	@ViewChild('map') mapElement: ElementRef;
  	map: any;
	tracker: any;
	title: string = "";
	myInput: any;

	searchTerm: string = '';
	/*static get parameters(){
		return [[LocationTracker]];
	}*/

	constructor(public navCtrl: NavController) { //public tck: LocationTracker
		//this.tracker = tck;
		this.title = "OndeTem?!";
	}

	ionViewDidLoad() {
		
	}

	itemTapped(event, item) {
		this.navCtrl.push(ProductPage, {
			item: item
		});
	}

	open(event, item) {
		switch(item) {
			case 'cat':
				this.navCtrl.push(CategoryPage);
				break;
			case 'search':
				this.navCtrl.push(SearchPage);
				break;
			case 'mic':
				this.navCtrl.push(CategoryPage);
				break;
		}
	}

	onInput() {

	}

	onCancel() {}

	start() {
		/*this.tracker.startTracking()
		.subscribe((position) => {
			console.log(position);
		});*/
		this.initializeMap();
	}

	stop() {
		//this.tracker.stopTracking();
	}

	initializeMap() {
		Geolocation.getCurrentPosition().then((position) => {

	    var minZoomLevel = 12;
	    //let latLng = new google.maps.LatLng(-25.428954, -49.267137);
	    let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	 
	    let mapOptions = {
	      center: latLng,
	      zoom: minZoomLevel,
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    }

    	this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    }, (err) => { console.log(err); });
	}

	addMarker() {
		let marker = new google.maps.Marker({
			map: this.map,
			animation: google.maps.Animation.DROP,
			position: this.map.getCenter()
		});

		let content = "<h4>Information!</h4>";          

		this.addInfoWindow(marker, content);
	}

	addInfoWindow(marker, content) {
		let infoWindow = new google.maps.InfoWindow({
			content: content
		});

		google.maps.event.addListener(marker, 'click', () => {
			infoWindow.open(this.map, marker);
		});
	}

/*

let locationOptions = {timeout: 10000, enableHighAccuracy: true};
 
      navigator.geolocation.getCurrentPosition(

          (position) => {

              let options = {
                center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
              }

              this.map = new google.maps.Map(document.getElementById("map_canvas"), options);
          },

          (error) => {
              console.log(error);
          }, locationOptions

      );

*/
}
