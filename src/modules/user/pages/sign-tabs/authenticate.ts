import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../../../validators/validators';

import { AppService } from '../../../common/services/app.service';
import { UserService} from '../../services/user.service';

@Component({
  selector: 'page-authenticate',
  templateUrl: 'authenticate.html'
})
export class AuthenticatePage {
  signInForm: any;
  //logInModel: { username?: string, password?: string } = { email: '', pass: '' };

  signUpForm: any;
  //signUpModel: { name?: string, username?: string, password?: string } = { name: '', email: '', pass: '' }; //phone?: number, verificationCode?: number,

  forgotForm: any;
  //forgotModel: { username?: string } = { email: '' };

  currentModal: string = 'LogIn';

  // getVerificationCodeBtnText: string;
  // getVerificationCodeBtnDisabled: boolean = false;

  // facebook something

  constructor(
    public theApp: AppService,
    public userService: UserService,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder
  ) {
    //this.getVerificationCodeBtnText = 'Verification Code';

    this.signInForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });

    this.signUpForm = formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      password: ['', Validators.compose([Validators.required, ValidationService.passwordValidator])],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.pattern('true')]
    }, { validator: ValidationService.matchingPasswords('password', 'confirmPassword')});

    this.forgotForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
    });

    if (this.theApp.platform.is('cordova')) {
      
    }
  }

  cancelModal() {
    this.viewCtrl.dismiss();
  }

  logInHandler() {
    let self = this;
    let data = {
      'AuthModel[username]': self.signInForm.value.username,
      'AuthModel[password]': self.signInForm.value.password
    };

    if (self.signInForm.valid) {
      self.theApp.util.presentLoading('Autenticando...');

      // self.theApp.authService.authenticate(auth)
      self.userService.logIn(data)
        .then((ret) => {
          self.theApp.authService.logIn(ret);
          self.viewCtrl.dismiss()
          .then(() => {
            self.theApp.util.dismissLoading();
            self.theApp.util.presentToast(ret.username + ', ' + 'Welcome back');
          });
        }, (err) => {
          setTimeout(() => {
            self.theApp.util.dismissLoading();
            //self.theApp.notifyError(err);
            self.theApp.util.presentAlter({title: 'Log In Failed', subTitle: err._body});
          });
        });
    } else {
      // error
    }
    //self.theApp.notifyError(new Error('Por favor preencha todos os campos corretamente!'));
  }

  signUpHandler() {
    let self = this;
    let data = {
      'AuthModel[name]': self.signUpForm.value.name,
      'AuthModel[username]': self.signUpForm.value.username,
      'AuthModel[password]': self.signUpForm.value.password,
      'AuthModel[confirmPassword]': self.signUpForm.value.confirmPassword,
      'AuthModel[terms]': self.signUpForm.value.terms
    };

    if (self.signUpForm.valid) {
      this.theApp.util.presentLoading();

      this.userService.signUp(data)
      .then((ret) => {
        this.theApp.authService.logIn(ret);
        this.viewCtrl.dismiss()
        .then(() => {
          this.theApp.util.dismissLoading();
          this.theApp.util.presentToast('Sign Up Success, Welcome ' + ret.username);
          //this.navCtrl.setRoot(TourPage);
        });
      }, (err) => {
        this.theApp.util.dismissLoading().then(() => {
          let body = JSON.parse(err._body);
          this.theApp.util.presentAlter({title: 'Sign Up Failed', subTitle: body[Object.keys(body)[0]]});
          //self.theApp.notifyError(err);
        });
      });
    }
  }

  forgotHandler() {
    let self = this;
    let data = {
      'AuthModel[username]': self.forgotForm.value.username
    };

    if (self.signInForm.valid) {
      self.theApp.util.presentLoading('Verificando...');

      // this.forgotForm.value
      this.userService.forgotPassword(data)
        .then((ret) => {
          self.theApp.authService.logIn(ret);
          self.viewCtrl.dismiss()
          .then(() => {
            self.theApp.util.dismissLoading();
            self.theApp.util.presentToast('Um email foi enviado com novas instruções');
          });
        }, (err) => {
          setTimeout(() => {
            self.theApp.util.dismissLoading();
            //self.theApp.notifyError(err);
            self.theApp.util.presentAlter({title: 'Ops... ', subTitle: err._body});
          });
        });
    }
  }

  loginWithFacebook() {}

  openTermsPage() {
    /*let url = (<any> window).API_DOMAIN + '/docs/terms.html';
    if (this.heyApp.platform.is('cordova')) {
      let browser = this.inAppBrowser.create(url);
      browser.show();
    } else {
      (<any> window).open(url, '_blank');
    }*/
  }

  /*getVerificationCode() {
    this.userService.getVerificationCode({phone: this.signUpModel.phone}).then((res) => {
      this.getVerificationCodeBtnText = '60s';
      this.getVerificationCodeBtnDisabled = true;

      let verificationCodeInterval = setInterval(() => {
        let t = this.getVerificationCodeBtnText.substr(0, this.getVerificationCodeBtnText.indexOf('s'));

        if (parseInt(t) > 1) {
          this.getVerificationCodeBtnText = parseInt(t) - 1 + 's';
        } else {
          clearInterval(verificationCodeInterval);
          this.getVerificationCodeBtnDisabled = false;
          this.getVerificationCodeBtnText = this.heyApp.translateService.instant('user.Get Verification Code');
        }
      }, 1000);
    }, (res) => {
      this.heyApp.util.presentAlter({title: this.heyApp.translateService.instant('Alert'), subTitle: res._body});
    });
  }*/
}