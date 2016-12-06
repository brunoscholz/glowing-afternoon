import { Component } from '@angular/core';
import { Nav } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../validators/validators';
import { TourPage } from '../tour/tour';

@Component({
  templateUrl: 'signup.html',
})
export class SignUpPage {
  signUpForm: any;

  constructor(private navCtrl: Nav,
              public formBuilder: FormBuilder,
              public auth: AuthService,
              public util: UtilProvider
  ) {
    this.signUpForm = formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      password: ['', Validators.compose([Validators.required, ValidationService.passwordValidator])],
      confirmPassword: ['', Validators.required]
    }, { validator: ValidationService.matchingPasswords('password', 'confirmPassword')});
  }

  signup() {
    if(!this.signUpForm.valid) {
      this.util.notifyError('Por favor preencha todos os campos corretamente!');
    } else {
      this.util.presentLoading('Aguarde...');
      setTimeout(() => {
        this.util.dismissLoading();
      }, 20000);

      this.auth.register(this.signUpForm.value).then(data => {
        if(data) {
          console.log(data);
          this.util.dismissLoading();
          this.navCtrl.setRoot(TourPage);
        }
      }, (err) => {
        this.util.dismissLoading();
        this.util.notifyError(err);
      });
    }
  }
}
