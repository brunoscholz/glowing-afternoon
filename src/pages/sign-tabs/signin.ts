import { Component } from '@angular/core';
import { Nav } from 'ionic-angular';
import { UserData } from '../../providers/services/user-data';

import { HomeTabsPage } from '../home-tabs/home-tabs';

@Component({
  templateUrl: 'signin.html',
})
export class SigninPage {
	login: { username?: string, password?: string } = {};
	submitted = false;

  constructor(private navCtrl: Nav, public userData: UserData) {

  }

  onLogin(form) {
  	this.submitted = true;
  	if(form.valid) {
  		this.userData.login(this.login.username);
  		this.navCtrl.setRoot(HomeTabsPage);
  	}
  }
}
