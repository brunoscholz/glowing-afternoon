import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SignUpPage } from './signup';
import { SignInPage } from './signin';
import { ForgotPage } from './forgot';
import { TermsPage } from '../../../../pages/about/terms';
import { PolicyPage } from '../../../../pages/about/policy';
import { HomeTabsPage } from '../../../../pages/home-tabs/home-tabs';

import { AppService } from '../../../common/services/app.service';
import { UserService } from '../../services/user.service';

@Component({
  templateUrl: 'sign-tabs.html',
})
export class SignTabsPage {

  constructor(
    public navCtrl: NavController,
    public theApp: AppService
  ) {
  }

  facebookConnect() {
    this.theApp.util.presentLoading('Autenticando...');
    this.theApp.authService.connectWithFacebook()
    .then(data => {
      if(data) {
        this.theApp.util.dismissLoading();
        this.navCtrl.setRoot(HomeTabsPage);
      }
    }, (err) => {
      this.theApp.util.dismissLoading();
      this.theApp.notifyError(err);
    });
  }

  signup() {
    this.navCtrl.push(SignUpPage);
  }

  signin() {
    this.navCtrl.push(SignInPage);
  }

  forgotPass() {
    this.navCtrl.push(ForgotPage);
  }

  openPolicy() {
    this.navCtrl.push(PolicyPage);
  }

  openTerms() {
    this.navCtrl.push(TermsPage);
  }
}
