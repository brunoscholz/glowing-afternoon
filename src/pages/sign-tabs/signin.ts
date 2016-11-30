import { Component } from '@angular/core';
import { Nav } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
//import { Facebook, NativeStorage } from 'ionic-native';

//import { Auth, User } from '@ionic/cloud-angular';

import { HomeTabsPage } from '../home-tabs/home-tabs';

@Component({
  templateUrl: 'signin.html',
})
export class SignInPage {
	login: { username?: string, password?: string } = {};
	submitted = false;

  constructor(private navCtrl: Nav, public auth: AuthService) {
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
