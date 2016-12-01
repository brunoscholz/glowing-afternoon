import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Follows page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-follows',
  templateUrl: 'follows.html'
})
export class Follows {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello Follows Page');
  }

}
