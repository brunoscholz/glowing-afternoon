import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../validators/validators';
import { ControlMessages } from '../../components/control-messages/control-messages';

@Component({
  templateUrl: 'forgot.html',
})
export class ForgotPage {
  submitAttempt: boolean = false;
  forgotForm: any;

  constructor(private navCtrl: NavController,
              public formBuilder: FormBuilder,
              public auth: AuthService,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController
  ) {
    this.forgotForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
    });
  }

  sendEmail() {
    this.submitAttempt = true;
    let loading = this.loadingCtrl.create({
      content: 'Verificando...'
    });

    setTimeout(() => {
      loading.dismiss();
    }, 20000);

    if(this.forgotForm.valid) {
      loading.present();
      this.auth.forgotPassword(this.forgotForm.value).then(data => {
        if(data) {
          console.log(data);
          loading.dismiss();
          let toast = this.getToast('Email enviado');
          toast.present();
          //this.navCtrl.setRoot(HomeTabsPage);
        }
      },
      (err) => {
      	loading.dismiss();
      	console.log('error: ' + err);
      });
    }
  }

  getToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration:4000
    });
    return toast;
  }
}
