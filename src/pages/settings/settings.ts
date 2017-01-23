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
    this.presentPictureSource()
    .then(source => {
      let sourceType:number = Number(source);
      return this.util.getPicture(sourceType);
    })
    .then((imageData) => {
      //var blobImage = this.util.dataURItoBlob(imageData);
      //this.profile.picture.thumbnail = imageData;
      this.util.presentLoading('Atualizando...');
      setTimeout(() => {
        this.util.dismissLoading();
      }, 20000);

      let data = {};
      let t = this.profile.type + "Id";
      data['form'][t] = this.profile.id;
      let ot = this.profile.type == 'buyer' ? 'sellerId' : 'buyerId';
      data['form'][ot] = '';

      let pic = { 'imageCover': imageData };

      this.dataService.updateProfile({
        form: data,
        picture: pic
      }).then((res) => {
        if(res) {
          this.util.dismissLoading();
          let toast = this.util.getToast("Foto Alterada com Sucesso");
          toast.present();
          return this.auth.checkAuthentication();
        }
      }, (err) => {
        this.util.dismissLoading();
        this.util.notifyError(err);
      });
    })
    .then((usr) => {});
  }

  updateAvatar() {
    this.presentPictureSource()
    .then(source => {
      let sourceType:number = Number(source);
      return this.util.getPicture(sourceType, true, { width: 256, height: 256 });
    })
    .then((imageData) => {
      //var blobImage = this.util.dataURItoBlob(imageData);
      //this.profile.picture.thumbnail = imageData;
      //return this.userProvider.uploadPicture(blobImage);
      
      this.util.presentLoading('Atualizando...');
      setTimeout(() => {
        this.util.dismissLoading();
      }, 20000);

      let data = {};
      let t = this.profile.type + "Id";
      data['form'][t] = this.profile.id;
      let ot = this.profile.type == 'buyer' ? 'sellerId' : 'buyerId';
      data['form'][ot] = '';

      let pic = { 'imageThumb': imageData };

      this.dataService.updateProfile({
        form: data,
        picture: pic
      }).then((res) => {
        if(res) {
          this.util.dismissLoading();
          let toast = this.util.getToast("Foto Alterada com Sucesso");
          toast.present();
          return this.auth.checkAuthentication();
        }
      }, (err) => {
        this.util.dismissLoading();
        this.util.notifyError(err);
      });
    })
    .then((usr) => {});
  }

  presentPictureSource() {
    let promise = new Promise((res, rej) => {
      let ac = this.actionSheet.create({
        title: 'Selecione a fonte da Imagem',
        buttons: [
          { text: 'Camera', handler: () => { res(1); } },
          { text: 'Galeria', handler: () => { res(0); } },
          { text: 'Cancelar', role: 'cancel', handler: () => { rej('cancel'); } }
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
      handler: data => {
        let t = this.profile.type + "Id";
        data[t] = this.profile.id;
        let ot = this.profile.type == 'buyer' ? 'sellerId' : 'buyerId';
        data[ot] = '';
        this.updateUsername(data);
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
        this.updatePassword(data);
      }
    });

    alert.present();
  }

  connectFacebook() {
    console.log('Clicked to connect with facebook');
  }

  logout() {
    console.log('Clicked logout');
  }

  updateUsername(data) {
    this.util.presentLoading('Atualizando...');
    setTimeout(() => {
      this.util.dismissLoading();
    }, 20000);
      
    this.dataService.updateProfile({
      username: data
    }).then((res) => {
      if(res) {
        this.util.dismissLoading();
        let toast = this.util.getToast("Nome Alterado com Sucesso");
        toast.present();
        return this.auth.checkAuthentication();
      }
    }, (err) => {
      this.util.dismissLoading();
      this.util.notifyError(err);
    })
    .then((usr) => {});
  }

  updatePassword(data) {
    this.util.presentLoading('Atualizando...');
    setTimeout(() => {
      this.util.dismissLoading();
    }, 20000);
      
    this.dataService.updateProfile({
      pass: data
    }).then((res) => {
      if(res) {
        this.util.dismissLoading();
        let toast = this.util.getToast("Senha Alterada com Sucesso");
        toast.present();
        return this.auth.checkAuthentication();
      }
    }, (err) => {
      this.util.dismissLoading();
      this.util.notifyError(err);
    })
    .then((usr) => {});
  }
}
