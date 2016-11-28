import { Component } from '@angular/core';
import { Nav } from 'ionic-angular';
import { AuthService } from '../../providers/services/auth.service';
import { Facebook, NativeStorage } from 'ionic-native';

//import { Auth, User } from '@ionic/cloud-angular';

import { HomeTabsPage } from '../home-tabs/home-tabs';

@Component({
  templateUrl: 'signin.html',
})
export class SignInPage {
	login: { username?: string, password?: string } = {};
	submitted = false;

  constructor(private navCtrl: Nav, public auth: AuthService) {
    //public auth: Auth, public user: User
  }

  log() {
    /*let details = {'email': 'hi@ionic.io', 'password': 'puppies123'};
    this.auth.login('basic', details).then(() => {
      console.log('logged in');
    });*/
  }

  signin() {
    console.log(this.login);
    this.auth.authenticate(this.login).then(data => {
      if(data) {
        console.log(data);
          this.navCtrl.setRoot(HomeTabsPage);
      }
    });
  }

  dummy() {}

  facebookConnect() {
    this.auth.connectWithFacebook();
  }
}
