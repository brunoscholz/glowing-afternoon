import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';

import { ProfileModalPage } from './modal';
import { FollowsPage } from '../../pages/follows/follows';
import { FavoritesPage } from '../../pages/favorites/favorites';
import { ReviewListPage } from '../../pages/review-list/review-list';
import { SettingsPage } from '../../pages/settings/settings';
import { BalancePage } from '../../pages/balance/balance';

import { IProfile, IBalance } from '../../modules/common/models/interfaces';

@Component({
  selector: 'user-profile',
  templateUrl: 'user.html'
})
export class UserProfileCmp {
  @Input('feed') profile: IProfile;
  @Input('coins') balance: IBalance;
  @Input('uProfiles') userProfiles: IProfile[];
  @Output('notify') notify: EventEmitter<IProfile> = new EventEmitter<IProfile>();

  // change based on profile type

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController) {}

  gotoFollowers(event) {
    this.navCtrl.push(FollowsPage, {
      me: true,
      profile: this.profile
    });
  }

  gotoFollows(event) {
    this.navCtrl.push(FollowsPage, {
      me: false,
      profile: this.profile
    });
  }

  gotoFavorites(event) {
    this.navCtrl.push(FavoritesPage, {
      profile: this.profile
    });
  }

  gotoReviews(event) {
    this.navCtrl.push(ReviewListPage, {
      profile: this.profile,
      offer: null
    });
  }

  gotoSettings(event) {
    this.navCtrl.push(SettingsPage, {
      profile: this.profile
    });
  }

  gotoBank(event) {
    this.navCtrl.push(BalancePage);
  }

  /*changeProfile() {
    this.notify.emit('Click from nested component');
  }*/

  showRadio() {
    // modal...
    let modal = this.modalCtrl.create(ProfileModalPage, { userProfiles: this.userProfiles });
    modal.onDidDismiss((profile) => {
      if(profile) {
        this.notify.emit(profile);
      }
    });

    modal.present();

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