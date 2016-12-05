import { Component } from '@angular/core';
import { Nav, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../validators/validators';

import { HomeTabsPage } from '../home-tabs/home-tabs';

@Component({
  templateUrl: 'signin.html',
})
export class SignInPage {
	submitAttempt: boolean = false;
  signInForm: any;
  serverError: boolean = false;
  serverMessage: string = '';

  constructor(private navCtrl: Nav,
              public formBuilder: FormBuilder,
              public auth: AuthService,
              public loadingCtrl: LoadingController
  ) {
    this.signInForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  signin() {
    this.submitAttempt = !this.signInForm.valid;
    let loading = this.loadingCtrl.create({
      content: 'Autenticando...'
    });

    setTimeout(() => {
      loading.dismiss();
    }, 20000);

    if(this.signInForm.valid) {
      loading.present();
      this.auth.authenticate(this.signInForm.value).then(data => {
        if(data) {
          console.log(data);
          loading.dismiss();
          this.navCtrl.setRoot(HomeTabsPage);
        }
      }, (err) => {
        loading.dismiss();
        this.serverError = true;
        this.serverMessage = err;
      });
    }
  }

  dummy() {}

  facebookConnect() {
    this.auth.connectWithFacebook();
  }
}
