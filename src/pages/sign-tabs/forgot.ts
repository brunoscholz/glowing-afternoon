import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'forgot.html',
})
export class ForgotPage {

  constructor(private navCtrl: NavController) {

  }

  SendEmail() {
    console.log("Not really sending email now! Fix it");
  }

}
