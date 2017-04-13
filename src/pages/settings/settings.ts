import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { IUser, IProfile } from '../../providers/data/interfaces';
import { ModelPage } from '../model-page';

//import {Camera} from 'ionic-native';

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html',
})
export class SettingsPage extends ModelPage {
	user: IUser = null;
  preferred: any;
  profile: IProfile = null;

  constructor(private navCtrl: NavController,
              navParams: NavParams,
              public actionSheet: ActionSheetController,
              public dataService: DataService,
              public auth: AuthService,
              public util: UtilProvider) {
  	super('Configurações', dataService, util)
    this.profile = navParams.get('profile');
  }

  updatePicture() {
    let self = this;
    this.presentPictureSource()
    .then((source: number) => {
      let sourceType:number = source;
      return self.util.getPicture(sourceType);
    })
    .then((imageData) => {
      //var blobImage = this.util.dataURItoBlob(imageData);
      //this.profile.picture.thumbnail = imageData;
      self.util.presentLoading('Atualizando...');
      return self.formUserModel(imageData, 'imageCover');
    })
    .then((body) => {
      return self.dataService.updateProfile({
        controller: 'auth/settings',
        data: body
      });
    })
    .then((res) => {
      return self.finishUpdate(res);
    })
    .then((usr) => {
      self.util.dismissLoading();
    })
    .catch((err) => {
      self.util.dismissLoading();
      if(err.message != 'cameraCancelled')
        self.util.notifyError(err);
    });
  }

  updateAvatar() {
    let self = this;
    this.presentPictureSource()
    .then((source: number) => {
      let sourceType:number = Number(source);
      return self.util.getPicture(sourceType, true, { width: 256, height: 256 });
    })
    .then((imageData) => {
      self.util.presentLoading('Atualizando...');
      return self.formUserModel(imageData, 'imageThumb');
    })
    .then((body) => {
      return self.dataService.updateProfile({
        controller: 'auth/settings',
        data: body
      });
    })
    .then((res) => {
      return self.finishUpdate(res);
    })
    .then((usr) => {
      self.util.dismissLoading();
    })
    .catch((err) => {
      self.util.dismissLoading();
      if(err.message != 'cameraCancelled')
        self.util.notifyError(err);
    });
  }

  formUserModel(imageData, imgType = 'imageCover') {
    let self = this;
    let promise = new Promise((resolve, reject) => {
      let body = { UserForm: {}, Picture: {} };

      let prefer = self.profile.type + "Id";
      let other = self.profile.type == 'buyer' ? 'sellerId' : 'buyerId';

      body['UserForm'][prefer] = self.profile.id;
      body['UserForm'][other] = '';
      body['Picture'][imgType] = imageData;
      resolve(body);
    });
    return promise;
  }

  finishUpdate(response) {
    let self = this;
    let promise = new Promise((resolve, reject) => {
      let toast = self.util.getToast(response);
      toast.present();
      return self.auth.checkAuthentication();
    });
    return promise;
  }

  presentPictureSource() {
    let promise = new Promise((resolve, reject) => {
      let ac = this.actionSheet.create({
        title: 'Selecione a fonte da Imagem',
        buttons: [
          { text: 'Camera', handler: () => { resolve(1); } },
          { text: 'Galeria', handler: () => { resolve(0); } },
          { text: 'Cancelar', role: 'cancel', handler: () => { reject(new Error('cameraCancelled')); } }
        ]
      });
      ac.present();
    });
    return promise;
  }

  changeUsername() {
    let alert = this.util.doAlert('Alterar Nome', '', 'Cancelar');
    alert.addInput({
      name: 'username',
      value: this.profile.name,
      placeholder: 'username'
    });
    alert.addButton({
      text: 'Ok',
      handler: (data) => {
        let prefer = this.profile.type + "Id";
        let other = this.profile.type == 'buyer' ? 'sellerId' : 'buyerId';
        let body = {
          UserForm: {
            username: data.username,
          }
        };
        body['UserForm'][prefer] = this.profile.id;
        body['UserForm'][other] = '';
        this.updateUsername(body);
      }
    });

    alert.present();
  }

  changePassword() {
    let alert = this.util.doAlert('Alterar Senha', '', 'Cancelar');
    alert.addInput({
      type: 'password',
      name: 'currentPassword',
      value: '',
      placeholder: 'senha atual'
    });
    alert.addInput({
      type: 'password',
      name: 'newPassword',
      value: '',
      placeholder: 'nova senha'
    });
    alert.addInput({
      type: 'password',
      name: 'confirmPassword',
      value: '',
      placeholder: 'confirmar senha'
    });
    alert.addButton({
      text: 'Ok',
      handler: data => {
        let body = {
          UserForm: {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword
          }
        }
        this.updatePassword(body);
      }
    });

    alert.present();
  }

  connectFacebook() {
    console.log('Clicked to connect with facebook');
  }

  logout() {
    this.auth.logout();
  }

  updateUsername(body) {
    let self = this;
    self.util.presentLoading('Atualizando...');
    self.dataService.updateProfile({
      controller: 'auth/settings',
      data: body
    })
    .then((res) => {
      return self.finishUpdate(res);
    })
    .then((usr) => {
      self.util.dismissLoading();
    })
    .catch((err) => {
      self.util.dismissLoading();
      self.util.notifyError(err);
    });
  }

  updatePassword(body) {
    let self = this;
    self.util.presentLoading('Atualizando...');
    self.dataService.updateProfile({
      controller: 'auth/settings',
      data: body
    }).then((res) => {
      return self.finishUpdate(res);
    })
    .then((usr) => {
      self.util.dismissLoading();
    })
    .catch((err) => {
      self.util.dismissLoading();
      self.util.notifyError(err);
    });
  }
}
