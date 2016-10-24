import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController } from 'ionic-angular';
import { ElasticHeader } from '../../directives/elastic-header';

/*
  Generated class for the ProfilePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage {
	reviews: any = [];
	backimg: any;
	rows: any;

  constructor(private navCtrl: NavController, private sanitizer: DomSanitizer) {
  	this.backimg = sanitizer.bypassSecurityTrustUrl('assets/img/card-saopaolo.png');
  	this.rows = Array.from(Array(Math.ceil(this.reviews.length / 2)).keys());
  }

}
