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
import { ModelPage } from '../model-page';
// import { ReviewPage } from '../review/review';
// import { ReviewDetailPage } from '../review-detail/review-detail';
import { DataService } from '../../providers/data/data.service';
import { AuthService } from '../../providers/auth/auth.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { UserOptionsPage } from './user-options';

import { ViewStatusEnum } from '../../providers/utils/enums';
import { IBuyer, IUser } from '../../providers/data/interfaces';
import _ from 'underscore';

@Component({
  templateUrl: 'user-detail.html',
})
export class UserDetailPage extends ModelPage {
  buyer: IBuyer;
  user: IUser;
  bgImage: string;
  canFollow: boolean = true;

  constructor(public navCtrl: NavController,
              navParams: NavParams,
              public acCtrl: ActionSheetController,
              public modCtrl: ModalController,
              public popoverCtrl: PopoverController,
              public dataService: DataService,
              public auth: AuthService,
              public util: UtilProvider
  ) {
    super("Buyer Details", dataService, util);
    this.buyer = navParams.get('user');
    this.bgImage = this.buyer.picture.cover;
  }

  ionViewDidLoad() {
    this.doReset(this.buyer.name);
    this.load();

    let self = this;
    self.auth.getUserInfo()
    .then((user: IUser) => {
      self.user = user;
      let ids = _.pluck(user.buyer.following, 'buyerId');
      self.canFollow = self.buyer.buyerId !== user.buyer.buyerId;
      self.canFollow = self.canFollow && !_.contains(ids, self.buyer.buyerId);
    });
  }

  load() {
    //var self = this;
    this.doChangeView(ViewStatusEnum.Empty);
    this.util.presentLoading('Buscando...');

    /*this.dataService.getPretty({
      controller: 'catalog',
      url: 'sellers/catalog/' + self.company.sellerId
    }).then((data: Array<IOffer>) => {
      self.offers = data;
      self.changeViewState();
      if(self.refresher)
        self.refresher.complete();
    }, (err) => {
      console.log(err);
    });*/
  }

  changeViewState() {
    if(this.buyer) // && this.offers
      this.doChangeView(ViewStatusEnum.Full);
    else
      this.doChangeView(ViewStatusEnum.Empty);
    this.util.dismissLoading();
  }

  doRefresh(refresher) {
    //this.refresher = refresher;
    this.load();
  }

  moreOptions(myEvent) {
    let popover = this.popoverCtrl.create(UserOptionsPage, { canFollow: this.canFollow });
    popover.onDidDismiss((act) => {
      if(act == 'follow')
        this.follow();
      if(act == 'unfollow')
        this.unfollow();
    });
    popover.present({
      ev: myEvent
    });
  }

  follow() {
    let self = this;
    self.util.presentLoading('Aguarde..');
    let fav = {
      FollowFact: {
        action: 'follow',
        userId: self.user.buyer.buyerId,
        buyerId: self.buyer.buyerId,
        sellerId: ''
      }
    }
    self.dataService.addSocialAction({
      controller: 'follow-facts',
      data: fav
    })
    .then(() => {
      let toast = self.util.getToast('Você está seguindo ' + self.buyer.name);
      toast.present();
    }, (err) => {
      console.log(err);
      self.util.dismissLoading();
      self.util.notifyError(err);
    });
  }

  unfollow() {
    let self = this;
    self.util.presentLoading('Aguarde..');
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
    self.dataService.addSocialAction({
      controller: 'follow-facts/' + ff.followFactId,
      data: fav
    })
    .then(() => {
      let toast = self.util.getToast('Você parou de seguir ' + self.buyer.name);
      toast.present();
    }, (err) => {
      console.log(err);
      self.util.dismissLoading();
      self.util.notifyError(err);
    });
  }
}
