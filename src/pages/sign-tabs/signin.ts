import { Component } from '@angular/core';
import { Nav } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../validators/validators';

import { HomeTabsPage } from '../home-tabs/home-tabs';

@Component({
  templateUrl: 'signin.html',
})
export class SignInPage {
  signInForm: any;
  userInfo: { email: string, pass: string } = { email: '', pass: '' };

  constructor(private navCtrl: Nav,
              public formBuilder: FormBuilder,
              public auth: AuthService,
              public util: UtilProvider
  ) {
    this.signInForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  signin() {
    if(!this.signInForm.valid) {
      this.util.notifyError(new Error('Por favor preencha todos os campos corretamente!'));
    } else {
      this.util.presentLoading('Autenticando...');

      let auth = {
        'AuthModel[username]': this.signInForm.value.username,
        'AuthModel[password]': this.signInForm.value.password
      };

      let self = this;
      self.auth.authenticate(auth)
      .then((data) => {
        if(data) {
          setTimeout(() => {
            self.util.dismissLoading();
            self.navCtrl.setRoot(HomeTabsPage);
          });
        }
      }, (err) => {
        setTimeout(() => {
          self.util.dismissLoading();
          self.util.notifyError(err);
        });
      });
    }
  }
}
