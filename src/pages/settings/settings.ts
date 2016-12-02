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
  profile: any;

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

  presentPictureSource() {
    let promise = new Promise((res, rej) => {
      let ac = this.actionSheet.create({
        title: 'Select Picture Source',
        buttons: [
          { text: 'Camera', handler: () => { res(1); } },
          { text: 'Gallery', handler: () => { res(0); } },
          { text: 'Cancel', role: 'cancel', handler: () => { rej('cancel'); } }
        ]
      });
      ac.present();
    });
    return promise;
  }

  changeUsername() {
    let alert = this.util.doAlert('Change Username', '', 'Cancel');
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
    console.log('Clicked to change password');
  }

  connectFacebook() {
    console.log('Clicked to connect with facebook');
  }

  logout() {
    console.log('Clicked logout');
  }

  updateProfile() {
    let toast = this.util.getToast("Your Profile is updated");
    //this.userProvider.updateProfile({name: this.user['name'], about: this.user['about']})
    toast.present();
    /*this.dataService.updateProfile(this.user)
    .then(()=> {
    });*/
  }
}
