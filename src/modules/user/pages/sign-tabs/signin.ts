import { Component } from '@angular/core';
import { Nav } from 'ionic-angular';

import { Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../../../validators/validators';
import { HomeTabsPage } from '../../../../pages/home-tabs/home-tabs';

import { AppService } from '../../../common/services/app.service';
import { UserService } from '../../services/user.service';

@Component({
  templateUrl: 'signin.html',
})
export class SignInPage {
  signInForm: any;
  userInfo: { email: string, pass: string } = { email: '', pass: '' };

  constructor(
    private navCtrl: Nav,
    public formBuilder: FormBuilder,
    public theApp: AppService
  ) {
    this.signInForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  signin() {
    if(!this.signInForm.valid) {
      this.theApp.notifyError(new Error('Por favor preencha todos os campos corretamente!'));
    } else {
      this.theApp.util.presentLoading('Autenticando...');

      let auth = {
        'AuthModel[username]': this.signInForm.value.username,
        'AuthModel[password]': this.signInForm.value.password
      };

      let self = this;
      self.theApp.authService.authenticate(auth)
      .then((data) => {
        if(data) {
          setTimeout(() => {
            self.theApp.util.dismissLoading();
            self.navCtrl.setRoot(HomeTabsPage);
          });
        }
      }, (err) => {
        setTimeout(() => {
          self.theApp.util.dismissLoading();
          self.theApp.notifyError(err);
        });
      });
    }
  }
}
