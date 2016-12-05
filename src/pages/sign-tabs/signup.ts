import { Component } from '@angular/core';
import { Nav, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../validators/validators';
//import { UtilProvider } from '../../providers/utils/util.provider';
import { TourPage } from '../tour/tour';

@Component({
  templateUrl: 'signup.html',
})
export class SignUpPage {
  submitAttempt: boolean = false;
  signUpForm: any;
  serverError: boolean = false;
  serverMessage: string = '';

  constructor(private navCtrl: Nav,
              public formBuilder: FormBuilder,
              public auth: AuthService,
              public loadingCtrl: LoadingController
  ) {
    this.signUpForm = formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      password: ['', Validators.compose([Validators.required, ValidationService.passwordValidator])],
      confirmPassword: ['', Validators.required]
    }, { validator: ValidationService.matchingPasswords('password', 'confirmPassword')});
  }

  signup() {
    this.submitAttempt = !this.signUpForm.value;
    let loading = this.loadingCtrl.create({
      content: 'Aguarde...'
    });

    setTimeout(() => {
      loading.dismiss();
    }, 20000);

    if(this.signUpForm.valid) {
      loading.present();
      this.auth.register(this.signUpForm.value).then(data => {
        if(data) {
          console.log(data);
          loading.dismiss();
          this.navCtrl.setRoot(TourPage);
        }
      }, (err) => {
        loading.dismiss();
        this.serverError = true;
        this.serverMessage = err;
      });
    }
  }
}
