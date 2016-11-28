import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'forgot.html',
})
export class ForgotPage {
  login: { username?: string } = {};
  submitted = false;

  constructor(private navCtrl: NavController) {

  }

  sendEmail(event) {
    console.log("Not really sending email now! Fix it");
  }

}
