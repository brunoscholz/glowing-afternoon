/**
 * ProductDetailPage class
 *
 * Detail information about one item (product or service)
 * with all it's reviews. The item comes from navParams
 * 
 * It subscribes to dataService.reviews$ and on change
 * it loads the results into the @property review based on the query
 * in the load method
 *
*/
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { ModelPage } from '../model-page';
import { ReviewListPage } from '../review-list/review-list';
import { ReviewPage } from '../review/review';
import { GiftConfirmPage } from '../gift/gift-confirm';
import { CompanyDetailPage } from '../company-detail/company-detail';
import { ReviewDetailPage } from '../review-detail/review-detail';
import { DataService } from '../../providers/data/data.service';
import { AuthService } from '../../providers/auth/auth.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { ViewStatusEnum } from '../../providers/utils/enums';
import { IOffer, IUser } from '../../providers/data/interfaces';
import _ from 'underscore';

@Component({
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage extends ModelPage {
  product: IOffer;
  bgImage: string;
  user: IUser;
  canAdd: boolean = true;

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public modCtrl: ModalController,
    public dataService: DataService,
    public actionSheet: ActionSheetController,
    public auth: AuthService,
    public util: UtilProvider
  ) {
    super("Product Details", dataService, util);
    this.product = navParams.get('offer');
    this.bgImage = this.product.picture.cover;
  }

  ionViewWillEnter() {
    this.doReset(this.product.item.title);
    this.doToggleLoading(false);
    //this.load();
    let self = this;
    self.auth.getUserInfo()
    .then((user: IUser) => {
      self.user = user;
      let ids = _.pluck(user.buyer.favorites, 'offerId');
      self.canAdd = !_.contains(ids, self.product.offerId);
    });
  }

  load() {
    // redo the offer api call by this.product.offerId
    this.dataService.findAll({
      controller: 'offers',
      query: { 'offerId': this.product.offerId }
    }).then(() => {

    }, (err) => {

    });
  }

  changeViewState() {
    if (_.size(this.product.reviews) > 0) {
      this.doChangeView(ViewStatusEnum.Full);
    }
    else {
      this.doChangeView(ViewStatusEnum.Empty);
    }
    this.util.dismissLoading();
  }

  doRefresh(refresher) {
    //this.refresher = refresher;
    this.load();
  }

  // toggles the favorite on the offer
  favorite() {
    if (this.canAdd)
      this.addToList();
    else
      this.removeFromList();
  }

  addToList() {
    let self = this;
    self.util.presentLoading('Aguarde..');

    let fav = {
      FavoriteFact: {
        action: 'addToList',
        buyerId: self.user.buyer.buyerId,
        offerId: self.product.offerId
      }
    }
    self.dataService.addSocialAction({
      controller: 'favorite-facts',
      data: fav
    })
    .then(() => {
      let toast = self.util.getToast('Adicionado aos seus favoritos!');
      toast.present();
    }, (err) => {
      console.log(err);
      self.util.dismissLoading();
      self.util.notifyError(err);
    });
  }

  removeFromList() {
    let self = this;
    self.util.presentLoading('Aguarde..');
    let fav = {
      FavoriteFact: {
        action: 'removeFromList',
        buyerId: self.user.buyer.buyerId,
        offerId: self.product.offerId,
        status: 'REM'
      }
    }
    let ff = _.findWhere(self.user.buyer.favorites, { offerId: self.product.offerId });
    self.dataService.addSocialAction({
      controller: 'favorite-facts/' + ff.favoriteFactId,
      data: fav
    })
    .then(() => {
      let toast = self.util.getToast('Removido de seus favoritos!');
      toast.present();
    }, (err) => {
      console.log(err);
      self.util.dismissLoading();
      self.util.notifyError(err);
    });
  }

  share() {
    let self = this;
    let action = this.actionSheet.create({
      /*{
        text: 'Text',
        handler: () => {
          console.log('Text clicked');
        }
      },
      {
        text: 'Email',
        handler: () => {
          console.log('Email clicked');
        }
      },
      {
        text: 'Twitter',
        handler: () => {
          console.log('Twitter clicked');
        }
      },
      */
      buttons: [
        {
          text: 'Facebook',
          icon: 'facebook',
          cssClass: 'share-facebook',
          handler: () => {
            let price = self.product.pricePerUnit;
            price.toFixed(2).replace(/./g, function(c, i, a) {
              return i && c !== "," && ((a.length - i) % 3 === 0) ? '.' + c : c;
            });
            self.auth.shareWithFacebook({
              id: self.product.offerId,
              name: self.product.item.title,
              caption: 'Oferta da ' + self.product.seller.name,
              description: 'Achei no Onde tem?' + "\n" + 'R$ ' + price + '',
              picture: self.product.picture.cover,
              quote: 'Sensacional app de buscas!',
            });
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          style: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    action.present();
  }


  addReview() {
    let modal = this.modCtrl.create(ReviewPage, { item: this.product });
    modal.onDidDismiss(review => {
      if(review){
        this.saveReview(review);
      }
    });

    modal.present();
  }

  saveReview(review) {
    let self = this;
    self.util.presentLoading('Aguarde..');

    review.ReviewFact.buyerId = self.user.buyer.buyerId;
    this.dataService.addSocialAction({
      controller: 'review-facts',
      data: review
    })
    .then((data) => {
      if(data['status'] == 200) {
        let toast = self.util.getToast('Você ganhou '+data['credit']+' moedas pela avaliação. Obrigado!');
        //self.product.reviews.push(review);
        //this.dataService.creditUser(10);
        toast.present();
        self.util.dismissLoading();
      }
    }, (err) => {
      console.log(err);
      self.util.notifyError(err);
      self.util.dismissLoading();
    });
  }

  gotoCompany() {
    this.navCtrl.push(CompanyDetailPage, {
      company: this.product.seller
    });
  }

  gotoReviews(event) {
    this.navCtrl.push(ReviewListPage, {
      profile: null,
      offer: this.product
    });
  }

  deleteReview(review) {
    //Remove locally
    /*let index = this.product.reviews.indexOf(review);
    if(index > -1){
      this.product.reviews.splice(index, 1);
    }*/
    //Remove from database
    //this.reviewService.deleteReview(review._id);
  }

  confirmGiftBuy() {
    let modal = this.modCtrl.create(GiftConfirmPage, { offer: this.product });
    modal.onDidDismiss(review => {
      /*if(review){
        this.saveReview(review);
      }*/
    });

    modal.present();
  }

  reviewTapped(event, item) {
    this.navCtrl.push(ReviewDetailPage, {
      review: item,
      product: this.product
    });
  }

  getRating(rate) {
    // let rate = this.rating + this.attendance * 1000 + this.price * 100;
    // let decimal = rate - (Math.floor(rate / 100) * 100);
    // return decimal;
    if(rate >= 7)
      return 'green';
    else if(rate >= 4)
      return 'yellow';
    else
      return 'red';
  }

  hasField(field: any) {
    if (_.size(field) > 0)
      return true;

    return false;
  }
}
