import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileOptionsPage } from './options';

import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { ViewStatusEnum } from '../../providers/utils/enums';
import { IUser, IProfile } from '../../providers/data/interfaces';

import { ModelPage } from '../model-page';
import _ from 'underscore';

@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage extends ModelPage {
  user: IUser = null;
  balance: any = null;
  loginInfo: any;
	bgImage: string;
	rows: any;

  constructor(public navCtrl: NavController,
              navParams: NavParams,
              public sanitizer: DomSanitizer,
              public dataService: DataService,
              public auth: AuthService,
              public popoverCtrl: PopoverController,
              public util: UtilProvider
  ) {
  	super('Perfil', dataService, util);
  }

  ionViewDidLoad() {
    this.doReset("Perfil");
    this.load();
  }

  changeViewState() {
    if(this.user && this.balance)
      this.doChangeView(ViewStatusEnum.Full);
    else
      this.doChangeView(ViewStatusEnum.Empty);
    this.util.dismissLoading();
  }

  doRefresh(refresher) {
    this.load();
  }

  load() {
    let self = this;
    this.doChangeView(ViewStatusEnum.Empty);

    this.auth.loadUserCredentials().then((usr: IUser) => {
      if(usr) {
        self.user = usr;
        self.prepareUser();
        self.loadBalance();
        //self.doChangeTitle(this.profile.name);
      }
    }, (err) => {
      console.log(err);
    });
  }

  loadBalance () {
    this.util.presentLoading('Carregando usuário!');
    var self = this;
    // get balance
    self.dataService.getBalance({
      controller: 'loyalty',
      query: { 'userId': { test: "like binary", value: self.user.userId } },
      asset: 'coin'
    }).then((loyal) => {
      self.balance = loyal;
      self.changeViewState();
      if(self.refresher)
        self.refresher.complete();
    });
  }

  prepareUser() {
    if(!this.user.preferred)
      this.setProfile(this.getBuyerProfile());
    else
      this.setProfile(this.user.preferred);
  }

  getBuyerProfile() {
    //this.user.buyer.picture = this.util.fixPictureUrl(this.user.buyer.picture);
    
    let profile: IProfile = {
      id: this.user.buyer.buyerId,
      type: 'buyer',
      bgImage: this.user.buyer.picture.cover,
      name: this.user.buyer.name,
      username: this.user.buyer.email,
      picture: this.user.buyer.picture
    };
    this.doChangeTitle(profile.name);
    return profile;
  }

  getSellerProfile(id) {
    let seller = _.where(this.user.sellers, { sellerId: id });
    //seller[0].picture = this.util.fixPictureUrl(seller[0].picture);

    let profile: IProfile = {
      id: id,
      type: 'seller',
      bgImage: seller[0].picture.cover,
      name: seller[0].name,
      username: seller[0].email,
      picture: seller[0].picture
    };
    this.doChangeTitle(profile.name);
    return profile;
  }

  setProfile(pref: IProfile) {
    this.dataService.setPreferredProfile(pref)
    .then((usr: IUser) => {
      if(usr) {
        this.user = usr;
        this.doChangeTitle(pref.name);
      }
    });
  }

  hasField(field: any) {
    if (_.size(field) > 0)
      return true;

    return false;
  }

  moreOptions(myEvent) {
    let userProfiles = { profiles: [{ name: this.user.buyer.name, id: this.user.buyer.buyerId, pic: this.user.buyer.picture.thumbnail, type: 'buyer', index: 0 }] };
    let i = 1;
    this.user.sellers.forEach(function(entry) {
      //console.log(entry);
      userProfiles.profiles.push({ name: entry.name, id: entry.sellerId, pic: entry.picture.thumbnail, type: 'seller', index: i++ });
    });

    let popover = this.popoverCtrl.create(ProfileOptionsPage, userProfiles);
    popover.onDidDismiss(pref => {
      if(pref) {
        if(pref.type == 'seller')
          this.setProfile(this.getSellerProfile(pref.id));
        else
          this.setProfile(this.getBuyerProfile());
      }
    });
    popover.present({
      ev: myEvent
    });
  }

  followUser(user) {
    /*this.socialProvider.followUser(user)
    .then(()=> {
      let toast = this.util.getToast("You are now following " + user.name);
      this.navController.present(toast);
    });*/
  }
}
