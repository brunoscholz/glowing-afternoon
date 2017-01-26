import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../validators/validators';

@Component({
  templateUrl: 'forgot.html',
})
export class ForgotPage {
  forgotForm: any;

  constructor(private navCtrl: NavController,
              public formBuilder: FormBuilder,
              public auth: AuthService,
              public util: UtilProvider
  ) {
    this.forgotForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
    });
  }

  sendEmail() {
    if(!this.forgotForm.valid) {
      this.util.notifyError(new Error('Por favor preencha todos os campos corretamente!'));
    } else {
      this.util.presentLoading('Verificando...');
      setTimeout(() => {
        this.util.dismissLoading();
      }, 20000);

      this.auth.forgotPassword(this.forgotForm.value).then(data => {
        if(data) {
          this.util.dismissLoading();
          let toast = this.util.getToast('Email enviado');
          toast.present();
        }
      },
      (err) => {
      	this.util.dismissLoading();
        this.util.notifyError(err);
      });
    }
  }
}
