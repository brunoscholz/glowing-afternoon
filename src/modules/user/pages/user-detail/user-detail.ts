/**
 * CompanyDetailPage class
 *
 * Detail information about one company
 * with all it's offers and reviews. The item comes from navParams
 * 
 * It subscribes to dataService.reviews$ and on change
 * it loads the results into the @property review based on the query
 * in the load method
 *
*/
import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ModalController, PopoverController } from 'ionic-angular';

import { AppService } from '../../../common/services/app.service';
import { SocialService } from '../../../social/services/social.service';
import { UserService } from '../../services/user.service';

import { ViewStatusEnum } from '../../../common/models/enums';
import { IBuyer, IUser } from '../../../common/models/interfaces'; //ISearchResult
import { ModelPage } from '../../../common/pages/model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'user-detail.html',
})
export class UserDetailPage extends ModelPage {
  buyer: IBuyer;
  user: IUser;
  bgImage: string;
  canFollow: boolean = true;

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public acCtrl: ActionSheetController,
    public modCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public theApp: AppService,
    public userService: UserService,
    public socialService: SocialService
  ) {
    super("Perfil");
    this.buyer = navParams.get('user');
    this.bgImage = this.buyer.picture.cover;
  }

  ionViewDidLoad() {
    this.doReset(this.buyer.name);
    this.load();
  }

  load() {
    let self = this;
    self.doChangeView(ViewStatusEnum.Empty);
    self.theApp.util.presentLoading();
    self.theApp.authService.getUser()
    .then((user: IUser) => {
      self.user = user;
      let ids = _.pluck(user.buyer.following, 'buyerId');
      self.canFollow = self.buyer.buyerId !== user.buyer.buyerId;
      self.canFollow = self.canFollow && !_.contains(ids, self.buyer.buyerId);
      self.changeViewState(true);
    });
  }

  changeViewState(b: boolean) {
    this.doChangeViewState(b);
    this.theApp.util.dismissLoading();
  }

  doRefresh(refresher) {
    //this.refresher = refresher;
    this.load();
  }

  follow() {
    let self = this;
    self.theApp.util.presentLoading('Aguarde..');
    let fav = {
      FollowFact: {
        action: 'follow',
        userId: self.user.buyer.buyerId,
        buyerId: self.buyer.buyerId,
        sellerId: ''
      }
    }
    self.socialService.setFollow({
      data: fav
    })
    .then(() => {
      self.theApp.util.presentToast('Você está seguindo ' + self.buyer.name);
    }, (err) => {
      console.log(err);
      self.theApp.util.dismissLoading();
      self.theApp.notifyError(err);
    });
  }

  unfollow() {
    let self = this;
    self.theApp.util.presentLoading('Aguarde..');
    let fav = {
      FollowFact: {
        action: 'unfollow',
        userId: self.user.buyer.buyerId,
        buyerId: self.buyer.buyerId,
        sellerId: '',
        status: 'REM'
      }
    }
    let ff = _.findWhere(self.user.buyer.following, { buyerId: self.buyer.buyerId });
    self.socialService.setFollow({
      followId: ff.followFactId,
      data: fav
    })
    .then(() => {
      self.theApp.util.presentToast('Você parou de seguir ' + self.buyer.name);
    }, (err) => {
      console.log(err);
      self.theApp.util.dismissLoading();
      self.theApp.notifyError(err);
    });
  }
}
