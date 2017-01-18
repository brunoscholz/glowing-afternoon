import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { SignUpPage } from './signup';
import { SignInPage } from './signin';
import { ForgotPage } from './forgot';
import { TermsPage } from '../about/terms';
import { PolicyPage } from '../about/policy';
import { HomeTabsPage } from '../home-tabs/home-tabs';

@Component({
  templateUrl: 'sign-tabs.html',
})
export class SignTabsPage {

  constructor(public navCtrl: NavController,
              public auth: AuthService,
              public util: UtilProvider
  ) {
  }

  facebookConnect() {
    this.util.presentLoading('Autenticando...');
    setTimeout(() => {
      this.util.dismissLoading();
      //this.util.notifyError('Não foi possível fazer conectar...');
    }, 20000);
    
    this.auth.connectWithFacebook()
    .then(data => {
      if(data) {
        this.util.dismissLoading();
        this.navCtrl.setRoot(HomeTabsPage);
      }
    }, (err) => {
      this.util.dismissLoading();
      this.util.notifyError(err);
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
