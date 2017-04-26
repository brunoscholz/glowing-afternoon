import { Component } from '@angular/core';
import { Nav } from 'ionic-angular';

import { Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../../../validators/validators';
import { TourPage } from '../../../../pages/tour/tour';
import { TermsPage } from '../../../../pages/about/terms';
import { PolicyPage } from '../../../../pages/about/policy';

import { AppService } from '../../../common/services/app.service';

@Component({
  templateUrl: 'signup.html',
})
export class SignUpPage {
  signUpForm: any;
  userInfo: { name: string, email: string, pass: string } = { name: '', email: '', pass: '' };

  constructor(
    private navCtrl: Nav,
    public formBuilder: FormBuilder,
    public theApp: AppService
  ) {
    this.signUpForm = formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      password: ['', Validators.compose([Validators.required, ValidationService.passwordValidator])],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.pattern('true')]
    }, { validator: ValidationService.matchingPasswords('password', 'confirmPassword')});

  }

  signup() {
    if(!this.signUpForm.valid) {
      this.theApp.notifyError(new Error('Por favor preencha todos os campos corretamente!'));
    } else {
      this.theApp.util.presentLoading('Aguarde...');

      let auth = {
        'AuthModel[name]': this.signUpForm.value.name,
        'AuthModel[username]': this.signUpForm.value.username,
        'AuthModel[password]': this.signUpForm.value.password,
        'AuthModel[confirmPassword]': this.signUpForm.value.confirmPassword,
        'AuthModel[terms]': this.signUpForm.value.terms
      };

      this.theApp.authService.register(auth)
      .then((data) => {
        if(data) {
          this.theApp.util.dismissLoading();
          this.navCtrl.setRoot(TourPage);
        }
      }, (err) => {
        this.theApp.util.dismissLoading();
        this.theApp.notifyError(err);
      });
    }
  }

  openPolicy() {
    this.navCtrl.push(PolicyPage);
  }

  openTerms() {
    this.navCtrl.push(TermsPage);
  }
}
