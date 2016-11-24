import { Component } from '@angular/core';
import { Nav } from 'ionic-angular';
import { Auth, User } from '@ionic/cloud-angular';

import { HomeTabsPage } from '../home-tabs/home-tabs';

@Component({
  templateUrl: 'signin.html',
})
export class SignInPage {
	login: { username?: string, password?: string } = {};
	submitted = false;

  constructor(private navCtrl: Nav, public auth: Auth, public user: User) {

  }

  SignIn() {
    let details = {'email': 'hi@ionic.io', 'password': 'puppies123'};
    this.auth.login('basic', details).then(() => {
      console.log('logged in');
    });
  }

  onLogin(form) {
  	this.submitted = true;
  	if(form.valid) {
  		//this.userData.login(this.login.username);
  		//this.navCtrl.setRoot(HomeTabsPage);
  	}
  }
}
