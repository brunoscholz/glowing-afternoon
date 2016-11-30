import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController} from 'ionic-angular';

@Injectable()
export class UtilProvider {
  constructor(public alertCtrl: AlertController, public loadCtrl: LoadingController, public toastCtrl: ToastController) {
  }

  doAlert(title, message, buttonText) {
      let alert = this.alertCtrl.create({
          title: title,
          subTitle: message,
          buttons: [buttonText]
      });
      return alert; 
  }
  
  presentLoading(content) {
    let loading = this.loadCtrl.create({
      dismissOnPageChange: true,
      content: content
    });
    return loading;
  }

  getToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration:2000
    });
    return toast;
  }
}

