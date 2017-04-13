import { Component, Input } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';

import { IProfile } from '../../providers/data/interfaces';

@Component({
  selector: 'seller-profile',
  templateUrl: 'seller.html'
})
export class SellerProfileCmp {
  @Input('feed') profile: IProfile;
  //@Output('notify') notify: EventEmitter<IProfile> = new EventEmitter<IProfile>();

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController) {}

  gotoFollowers(event) {
    
  }

  gotoFollows(event) {
    /*this.navCtrl.push(FollowsPage, {
      me: false,
      profile: this.profile
    });*/
  }

  gotoFavorites(event) {
    /*this.navCtrl.push(FavoritesPage, {
      profile: this.profile
    });*/
  }

  gotoReviews(event) {
    /*this.navCtrl.push(ReviewListPage, {
      profile: this.profile,
      offer: null
    });*/
  }

  gotoSettings(event) {
    
  }

  gotoBank(event) {
    
  }

  /*changeProfile() {
    this.notify.emit('Click from nested component');
  }*/

  showRadio() {
    // modal...
    /*let modal = this.modalCtrl.create(ProfileModalPage, { userProfiles: this.userProfiles });
    modal.onDidDismiss((profile) => {
      if(profile) {
        this.notify.emit(profile);
      }
    });

    modal.present();*/

    /*let alert = this.alertCtrl.create();
    alert.setTitle('Selecione um perfil');

    console.log(this.userProfiles.profiles);
    this.userProfiles.profiles.forEach((item, index) => {
      alert.addInput({
        type: 'radio',
        label: item.name,
        value: item.id,
        checked: false
      });
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        // this.testRadioOpen = false;
        // this.testRadioResult = data;
      }
    });
    alert.present();*/
  }
}