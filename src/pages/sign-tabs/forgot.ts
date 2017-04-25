import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../validators/validators';

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
        this.util.dismissLoading();
      }, 20000);

      this.auth.forgotPassword(this.forgotForm.value).then(data => {
        if(data) {
          this.theApp.util.dismissLoading();
          let toast = this.util.getToast('Email enviado');
          toast.present();
        }
      },
      (err) => {
      	this.theApp.util.dismissLoading();
        this.theApp.notifyError(err);
      });
    }
  }
}
