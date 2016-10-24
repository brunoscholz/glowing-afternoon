import { Component } from '@angular/core';
import { Nav } from 'ionic-angular';

import { TourPage } from '../tour/tour';

@Component({
  templateUrl: 'signup.html',
})
export class SignupPage {

  constructor(private navCtrl: Nav) {

  }

  SignUp() {
    this.navCtrl.setRoot(TourPage);
  }

}
