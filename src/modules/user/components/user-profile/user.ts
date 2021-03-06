import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';
import { InAppBrowser } from  "@ionic-native/in-app-browser";

import { ProfileModalPage } from './modal';
import { FollowsPage } from '../../../social/pages/follows/follows';
import { FavoritesPage } from '../../../social/pages/favorites/favorites';
import { ReviewListPage } from '../../../social/pages/review-list/review-list';
import { SettingsPage } from '../../pages/settings/settings';
import { BalancePage } from '../../pages/balance/balance';
import { VoucherPage } from '../../pages/vouchers/voucher';

import { IProfile, IBalance } from '../../../common/models/interfaces';

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

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public iab: InAppBrowser
  ) {}

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

  gotoVouchers(event) {
    this.navCtrl.push(VoucherPage, {
      profile: this.profile
    });
  }

  gotoWeb() {
    //cordova.InAppBrowser.open(url, "_system", "location=true");
    const browser = this.iab.create('http://admin.ondetem-gn.com.br', '_self', { location: 'yes' });
  }

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