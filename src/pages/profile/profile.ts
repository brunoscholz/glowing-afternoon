import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import { AppService } from '../../modules/common/services/app.service';
import { DataService } from '../../modules/common/services/data.service';

import { ViewStatusEnum } from '../../modules/common/models/enums';
import { IUser, IProfile, IBalance } from '../../modules/common/models/interfaces';
import { ModelPage } from '../../modules/common/models/model-page';

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
  userProfiles: IProfile[];

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public sanitizer: DomSanitizer,
    public theApp: AppService,
    public dataService: DataService
  ) {
  	super('Perfil');
    this.color = 'primary';
  }

  ionViewDidLoad() {
    this.doReset("Perfil");
    this.loadAll();
  }

  changeViewState(b: boolean) {
    this.doChangeViewState(b);
    this.theApp.util.dismissLoading();
  }

  doRefresh(refresher) {
    this.loadAll();
  }

  loadAll() {
    let self = this;
    self.theApp.util.presentLoading('Carregando usuário!');
    self.load()
    .then((res) => {

      let profile: IProfile = {
        id: this.user.buyer.buyerId,
        type: 'buyer',
        bgImage: this.user.buyer.picture.cover,
        name: this.user.buyer.name,
        username: this.user.buyer.email,
        picture: this.user.buyer.picture
      };

      self.userProfiles = [];
      self.userProfiles.push(profile);
      self.user.sellers.forEach(function(entry) {
        let prof: IProfile = {
          id: entry.sellerId,
          type: 'seller',
          bgImage: entry.picture.cover,
          name: entry.name,
          username: entry.email,
          picture: entry.picture
        };
        self.userProfiles.push(prof);
      });

      self.changeViewState();
      if(self.refresher)
        self.refresher.complete();
    }, (err) => {
      self.theApp.util.dismissLoading();
      self.theApp.notifyError(err);
    });
  }

  load() {
    let self = this;
    self.doChangeView(ViewStatusEnum.Loading);

    let promise = new Promise((resolve, reject) => {
      self.auth.getUser()
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
    if(pref) {
      if(pref.type == 'seller')
        this.setProfile(this.getSellerProfile(pref.id));
      else
        this.setProfile(this.getBuyerProfile());
    }
  }
}
