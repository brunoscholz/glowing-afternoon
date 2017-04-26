import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../../../validators/validators';

import { AppService } from '../../../common/services/app.service';
import { UserService } from '../../services/user.service';

@Component({
  templateUrl: 'forgot.html',
})
export class ForgotPage {
  forgotForm: any;

  constructor(
    private navCtrl: NavController,
    public formBuilder: FormBuilder,
    public theApp: AppService
  ) {
    this.forgotForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
    });
  }

  sendEmail() {
    if(!this.forgotForm.valid) {
      this.theApp.notifyError(new Error('Por favor preencha todos os campos corretamente!'));
    } else {
      this.theApp.util.presentLoading('Verificando...');
      setTimeout(() => {
        this.theApp.util.dismissLoading();
      }, 20000);

      this.theApp.authService.forgotPassword(this.forgotForm.value).then(data => {
        if(data) {
          this.theApp.util.dismissLoading();
          this.theApp.util.presentToast('Email enviado');
        }
      },
      (err) => {
      	this.theApp.util.dismissLoading();
        this.theApp.notifyError(err);
      });
    }
  }
}
