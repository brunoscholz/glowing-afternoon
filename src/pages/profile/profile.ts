import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileOptionsPage } from './options';

import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { ViewStatusEnum } from '../../providers/utils/enums';
import { IUser, IProfile, IBalance } from '../../providers/data/interfaces';

import { ModelPage } from '../model-page';
import _ from 'underscore';

@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage extends ModelPage {
  user: IUser = null;
  balance: IBalance;
  loginInfo: any;
	bgImage: string;
	rows: any;
  userProfiles;

  constructor(public navCtrl: NavController,
              navParams: NavParams,
              public sanitizer: DomSanitizer,
              public dataService: DataService,
              public auth: AuthService,
              public util: UtilProvider
  ) {
  	super('Perfil', dataService, util);
    this.color = 'primary';
  }

  ionViewDidLoad() {
    this.doReset("Perfil");
    this.loadAll();
  }

  changeViewState() {
    if(this.user && this.balance)
      this.doChangeView(ViewStatusEnum.Full);
    else
      this.doChangeView(ViewStatusEnum.Empty);
    this.util.dismissLoading();
  }

  doRefresh(refresher) {
    this.loadAll();
  }

  loadAll() {
    let self = this;
    self.util.presentLoading('Carregando usuário!');
    self.load()
    .then((res) => {

      self.userProfiles = { profiles: [{ name: self.user.buyer.username, id: self.user.buyer.buyerId, pic: self.user.buyer.picture.thumbnail, type: 'buyer', index: 0 }] };
      let i = 1;
      self.user.sellers.forEach(function(entry) {
        self.userProfiles.profiles.push({ name: entry.name, id: entry.sellerId, pic: entry.picture.thumbnail, type: 'seller', index: i++ });
      });

      self.changeViewState();
      if(self.refresher)
        self.refresher.complete();
    }, (err) => {
      self.util.dismissLoading();
      self.util.notifyError(err);
    });
  }

  load() {
    let self = this;
    self.doChangeView(ViewStatusEnum.Loading);

    let promise = new Promise((resolve, reject) => {
      self.auth.getUserInfo()
      .then((usr: IUser) => {
        if(usr) {
          self.user = usr;
          self.prepareUser();
          return self.loadBalance(usr);
        }
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
    });
    return promise;
  }

  loadBalance (usr: IUser) {
    var self = this;
    let promise = new Promise((resolve, reject) => {
      // get balance
      self.dataService.getBalance({
        controller: 'transaction',
        query: { 'userId': { test: "like binary", value: usr.userId } },
        asset: 'coin'
      }).then((bal) => {
        self.balance = <IBalance>bal['balance'];
        resolve(true);
      }, (err) => {
        reject(err);
      });
    });
    return promise;
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

  followUser(user) {
    /*this.socialProvider.followUser(user)
    .then(()=> {
      let toast = this.util.getToast("You are now following " + user.name);
      this.navController.present(toast);
    });*/
  }

  onNotify(pref):void {
    //alert(message);
    if(pref) {
      if(pref.type == 'seller')
        this.setProfile(this.getSellerProfile(pref.id));
      else
        this.setProfile(this.getBuyerProfile());
    }
  }
}
