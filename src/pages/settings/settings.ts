import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
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
export class SettingsPage extends ModelPage implements OnInit {
	user: IUser = null;
  preferred: any;
  profile: IProfile = null;

  constructor(private navCtrl: NavController,
              public actionSheet: ActionSheetController,
              public dataService: DataService,
              public authService: AuthService,
              public util: UtilProvider) {
  	super('Configurações', dataService, util)
    //this.user = authService.
  }

  ngOnInit() {
    
  }

  updatePicture() {
    this.presentPictureSource()
    .then(source => {
      let sourceType:number = Number(source);
      return this.util.getPicture(sourceType);
    })
    .then(imageData => {
      //var blobImage = this.util.dataURItoBlob(imageData);
      //this.user.picture.thumbnail = imageData;
      console.log(imageData);
      //return this.userProvider.uploadPicture(blobImage);
      let toast = this.util.getToast('Your Picture is updated');
      toast.present();
    })
    .catch((ex) => {
      //console.log(ex);
    });
    /*.then(imageURL => {
      return this.userProvider.updateProfile({avatar: imageURL});
    })*/
    /*.then(()=> {
    });*/
  }

  updateAvatar() {}

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
      value: this.user.username,
      placeholder: 'username'
    });
    alert.addButton({
      text: 'Ok',
      handler: data => {
        this.user.username = data.username;
      }
    });

    alert.present();
  }

  changePassword() {
    let alert = this.util.doAlert('Alterar Senha', '', 'Cancelar');
    alert.addInput({
      type: 'password',
      name: 'currentPass',
      value: '',
      placeholder: 'senha atual'
    });
    alert.addInput({
      type: 'password',
      name: 'newPass',
      value: '',
      placeholder: 'nova senha'
    });
    alert.addInput({
      type: 'password',
      name: 'confirmPass',
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

  updatePassword(data) {
    let msg = "Senha Alterada com Sucesso";
    this.dataService.updateProfile({
      pass: data
    })
    .then((res) => {
      if(res["error"])
        msg = res["error"];

      let toast = this.util.getToast(msg);
      toast.present();
    });
  }

  updateProfile() {
    let toast = this.util.getToast("Perfil Atualizado");
    /*this.data.updateProfile({
      name: this.user['name'], 
      about: this.user['about']
    })*/

    this.dataService.updateProfile({
      user: this.user
    })
    .then(()=> {
      toast.present();
    });
  }
}
