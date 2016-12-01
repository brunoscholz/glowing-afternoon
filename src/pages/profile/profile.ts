import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ActionSheetController, PopoverController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileOptionsPage } from './options';

import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
//import { ViewStatusEnum } from '../../providers/utils/enums';
//import { ElasticHeader } from '../../directives/elastic-header';
import { IUser } from '../../providers/data/interfaces';

import { ModelPage } from '../model-page';
import _ from 'underscore';

@Component({
  templateUrl: 'profile.html',
})
export class ProfilePage extends ModelPage implements OnInit {
  user: IUser = null;
  balance: any = null;
  loginInfo: any;
	bgImage: string;
	rows: any;
  preferred: any;
  profile: any;

  constructor(public navCtrl: NavController,
              navParams: NavParams,
              public sanitizer: DomSanitizer,
              public dataService: DataService,
              public authService: AuthService,
              public actionSheet: ActionSheetController,
              public popoverCtrl: PopoverController,
              public util: UtilProvider) {
  	super('Perfil', dataService, util);
  }

  ngOnInit() {
    var self = this;

    self.dataService.balance$.subscribe((loyal) => {
      self.balance = loyal;
      console.log(loyal);
      this.doToggleLoading(false);
      if(self.refresher)
        self.refresher.complete();
    });
  }

  ionViewWillEnter() {
    this.doReset("Perfil");
    this.load();
  }

  changeViewState() {
    
  }

  doRefresh(refresher) {
    this.load();
  }

  load() {
    this.doToggleLoading(true);
    var self = this;

    this.dataService.getUser().then((res: IUser) => {
      if(res) {
        self.user = res;
        self.prepareUser();
        this.loadBalance();
        this.doChangeTitle(this.user.buyer.name);
      }
    });
  }

  loadBalance () {
    var self = this;
    self.dataService.findAll({
      controller: 'loyalty',
      query: { 'buyer.buyerId': { test: "like binary", value: self.user.buyer.buyerId } }
    });
  }

  prepareUser() {
    var self = this;
    //console.log(this.user);
    //this.bgImage = this.sanitizer.bypassSecurityTrustUrl(this.user.picture.large);
    //this.rows = Array.from(Array(Math.ceil(this.user.buyer.reviews.length / 2)).keys());
    self.dataService.getPreferredProfile()
      .then((ret) => {
        if(ret) {
          self.preferred = ret;
        }
        else {
          self.preferred = { type: 'buyer', id: self.user.buyer.buyerId };
        }

        if(self.preferred.type == 'buyer')
          self.getBuyerProfile();
        else
          self.getSellerProfile(self.preferred.id);
      });
  }

  getBuyerProfile() {
    this.bgImage = 'http://ondetem.tk/' + this.user.buyer.picture.cover;
    this.profile = {
      name: this.user.buyer.name,
      username: this.user.buyer.email,
      picture: this.user.buyer.picture
    };
    this.doChangeTitle(this.profile.name);
  }

  getSellerProfile(id) {
    let seller = _.where(this.user.sellers, { sellerId: id });

    this.bgImage = 'http://ondetem.tk/' + seller[0].picture.cover;
    this.profile = {
      name: seller[0].name,
      username: seller[0].email,
      picture: seller[0].picture
    };
    this.doChangeTitle(this.profile.name);
  }

  hasField(field: any) {
    if (_.size(field) > 0)
      return true;

    return false;
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
    });
    /*.then(imageURL => {
      return this.userProvider.updateProfile({avatar: imageURL});
    })*/
    /*.then(()=> {
    });*/
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
        this.preferred = pref;
        this.dataService.setPreferredProfile(this.preferred);
        if(this.preferred.type == 'buyer')
          this.getBuyerProfile();
        else
          this.getSellerProfile(this.preferred.id);
      }
    });
    popover.present({
      ev: myEvent
    });
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
