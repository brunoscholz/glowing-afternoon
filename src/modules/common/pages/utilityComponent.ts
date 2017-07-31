import { Component } from '@angular/core';
import { Events, ModalController, LoadingController, Loading, AlertController, Alert, ToastController, ActionSheetController } from 'ionic-angular';

@Component({
  selector: 'utility-component',
  templateUrl: 'utilityComponent.html'
})
export class UtilityComponent {
  loading: Loading;

  // constructor
  constructor(
    public events: Events,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController
  ) {
  }

  // register events
  registerEvents() {
    this.events.subscribe('appComp:presentLoading', () => {
      this.presentLoading();
    });

    console.log('has register for some utility component events');
  }

  // present loading
  presentLoading(m?) {
    let msg = m || 'Aguarde ...';
    this.loading = this.loadingCtrl.create({
      content: msg,
      duration: 5000,
    });

    return this.loading.present();
  }

  // dismiss loading
  dismissLoading() {
    return this.loading.dismiss();
  }

  // present alter
  presentAlter(params?) {
    if (!params) {
      params = {
        title: 'Alter',
        subTitle: '',
      }
    }

    let alert = this.alertCtrl.create({
      title: params.title,
      subTitle: params.subTitle,
      buttons: ['OK']
    });
    return alert.present();
  }

  doAlert(title, message, buttonText): Alert {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [buttonText]
    });
    return alert;
  
}
  // present confirm
  presentConfirm(params?) {
    if (!params) {
      params = {
        title: 'Confirmar',
        message: '',
      }
    }

    let confirm = this.alertCtrl.create({
      title: params.title,
      message: params.message,
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    return confirm.present();
  }

  // present toast
  presentToast(message: string, duration: number = 3000, position: string = 'top') {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      cssClass: 'hc-toast',
      position: position,
    });
    toast.present();
  }

  // present action sheet
  presentActionSheet(title = 'Operações', btns: Object[] = []) {
    let actionSheet = this.actionSheetCtrl.create({
      title: title,
      buttons: btns,
    });
    actionSheet.present();
  }

  // present modal
  presentModal(page, params: Object = {}, callback?) {
    let modal = this.modalCtrl.create(page, params);

    callback && modal.onDidDismiss(callback);

    modal.present();
  }
}
