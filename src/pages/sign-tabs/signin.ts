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
      this.util.notifyError('Por favor preencha todos os campos corretamente!');
    } else {
      this.util.presentLoading('Autenticando...');
      setTimeout(() => {
        this.util.dismissLoading();
      }, 20000);
      
      this.auth.authenticate(this.signInForm.value).then(data => {
        if(data) {
          this.util.dismissLoading();
          this.navCtrl.setRoot(HomeTabsPage);
        }
      }, (err) => {
        this.util.dismissLoading();
        this.util.notifyError(err);
      });
    }
  }
}
