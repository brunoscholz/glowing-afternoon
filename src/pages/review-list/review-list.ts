import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the ReviewList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-review-list',
  templateUrl: 'review-list.html'
})
export class ReviewList {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello ReviewList Page');
  }

}
