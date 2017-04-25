import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { AppService } from '../../modules/common/services/app.service';
import { DataService } from '../../modules/common/services/data.service';

//import { ViewStatusEnum } from '../../modules/common/models/enums';
import { IUser, IProfile } from '../../modules/common/models/interfaces';
import { ModelPage } from '../../modules/common/models/model-page';

//import {Camera} from 'ionic-native';

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html',
})
export class SettingsPage extends ModelPage {
	user: IUser = null;
  preferred: any;
  profile: IProfile = null;

  constructor(
    private navCtrl: NavController,
    navParams: NavParams,
    public actionSheet: ActionSheetController,
    public dataService: DataService,
    public theApp: AppService
  ) {
  	super('Configurações');
    this.profile = navParams.get('profile');
  }

  updatePicture() {
    let self = this;
    this.presentPictureSource()
    .then((source: number) => {
      let sourceType:number = source;
      return self.theApp.helper.getPicture(sourceType);
    })
    .then((imageData) => {
      self.theApp.util.presentLoading('Atualizando...');
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
      self.theApp.util.dismissLoading();
    })
    .catch((err) => {
      self.theApp.util.dismissLoading();
      if(err.message != 'cameraCancelled')
        self.theApp.notifyError(err);
    });
  }

  updateAvatar() {
    let self = this;
    this.presentPictureSource()
    .then((source: number) => {
      let sourceType:number = Number(source);
      return self.theApp.helper.getPicture(sourceType, true, { width: 256, height: 256 });
    })
    .then((imageData) => {
      self.theApp.util.presentLoading('Atualizando...');
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
      self.theApp.util.dismissLoading();
    })
    .catch((err) => {
      self.theApp.util.dismissLoading();
      if(err.message != 'cameraCancelled')
        self.theApp.notifyError(err);
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
      let toast = self.theApp.util.presentToast(response);
      return self.auth.getIsAuth();
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
    let alert = this.theApp.util.doAlert('Alterar Nome', '', 'Cancelar');
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
    let alert = this.theApp.util.doAlert('Alterar Senha', '', 'Cancelar');
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
    this.auth.logOut();
  }

  updateUsername(body) {
    let self = this;
    self.theApp.util.presentLoading('Atualizando...');
    self.dataService.updateProfile({
      controller: 'auth/settings',
      data: body
    })
    .then((res) => {
      return self.finishUpdate(res);
    })
    .then((usr) => {
      self.theApp.util.dismissLoading();
    })
    .catch((err) => {
      self.theApp.util.dismissLoading();
      self.theApp.notifyError(err);
    });
  }

  updatePassword(body) {
    let self = this;
    self.theApp.util.presentLoading('Atualizando...');
    self.dataService.updateProfile({
      controller: 'auth/settings',
      data: body
    }).then((res) => {
      return self.finishUpdate(res);
    })
    .then((usr) => {
      self.theApp.util.dismissLoading();
    })
    .catch((err) => {
      self.theApp.util.dismissLoading();
      self.theApp.notifyError(err);
    });
  }
}
