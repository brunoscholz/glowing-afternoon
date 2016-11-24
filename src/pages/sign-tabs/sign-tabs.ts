import { Component } from '@angular/core';
//import { NavController } from 'ionic-angular';
import { SignUpPage } from './signup';
import { SignInPage } from './signin';
import { ForgotPage } from './forgot';

@Component({
  templateUrl: 'sign-tabs.html',
})
export class SignTabsPage {

  tabsign1: any;
  tabsign2: any;
  tabsign3: any;

  constructor() {
    this.tabsign1 = SignUpPage;
    this.tabsign2 = SignInPage;
    this.tabsign3 = ForgotPage;
  }

  /*signup() {
    this.nav.setRoot(WelcomePage);
  }

  signin() {
    this.nav.setRoot(HomeTabsPage);
  }

  forgotPass() {}*/
}
