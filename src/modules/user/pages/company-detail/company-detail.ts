/**
 * CompanyDetailPage class
 *
 * Detail information about one company
 * with all it's offers and reviews. The item comes from navParams
 *
 *
*/
import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';

import { AppService } from '../../../common/services/app.service';
import { UserService } from '../../services/user.service';
import { OfferService } from '../../../offer/services/offer.service';

import { ViewStatusEnum } from '../../../common/models/enums';
import { ISeller, IOffer, IUser, IProfile } from '../../../common/models/interfaces';
import { ModelPage } from '../../../common/pages/model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'company-detail.html',
})
export class CompanyDetailPage extends ModelPage {
  company: ISeller;
  user: IUser;
  bgImage: string;
  canFollow: boolean = true;
  offers: IOffer[];
  profile: IProfile;

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public acCtrl: ActionSheetController,
    public modCtrl: ModalController,
    public theApp: AppService,
    public userService: UserService,
    public offerService: OfferService
  ) {
    super("Empreendimento");
    this.company = navParams.get('company');
    this.bgImage = this.company.picture.cover;
    //this.profile = this.getSellerProfile();
  }

  ionViewDidLoad() {
    super.doReset(this.company.name);
    this.load();

    let self = this;
    self.theApp.authService.getUser()
    .then((user: IUser) => {
      self.user = user;
      let ids = _.pluck(user.buyer.following, 'sellerId');
      //self.canFollow = self.buyer.buyerId !== user.buyer.buyerId;
      //self.canFollow = self.canFollow && !_.contains(ids, self.buyer.buyerId);
      self.canFollow = !_.contains(ids, self.company.sellerId);
    });
  }

  getSellerProfile() {
    let seller = this.company;
    //seller[0].picture = this.util.fixPictureUrl(seller[0].picture);

    let profile: IProfile = {
      id: seller.sellerId,
      type: 'seller',
      bgImage: seller.picture.cover,
      name: seller.name,
      username: seller.email,
      picture: seller.picture
    };
    return profile;
  }

  load() {
    var self = this;
    this.doChangeView(ViewStatusEnum.Empty);
    this.theApp.util.presentLoading('Buscando...');

    this.offerService.getCatalog({
      sellerId: self.company.sellerId
    }).then((data: Array<IOffer>) => {
      self.offers = data;
      self.changeViewState(true);
      if(self.refresher)
        self.refresher.complete();
    }, (err) => {
      console.log(err);
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

  moreOptions(myEvent) {
    /*let popover = this.popoverCtrl.create(CompanyOptionsPage, { canFollow: this.canFollow });
    popover.onDidDismiss((act) => {
      if(act == 'follow')
        this.follow();
      if(act == 'unfollow')
        this.unfollow();
      if(act == 'addReview')
        this.addReview();
      if(act == 'addReviewPlus')
        this.addReviewPlus();
    });
    popover.present({
      ev: myEvent
    });*/
  }

  deleteReview(review) {
    //Remove locally
    /*let index = this.company.reviews.indexOf(review);
    if(index > -1){
      this.company.reviews.splice(index, 1);
    }*/
    //Remove from database
    //this.reviewService.deleteReview(review._id);
  }

  reviewTapped(event, item) {
    /*this.navCtrl.push(ReviewDetailPage, {
      review: item,
      company: this.company
    });*/
  }
}
