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

import { ReviewListPage } from '../review-list/review-list';
import { ReviewPage } from '../review/review';
import { GiftConfirmPage } from '../gift/gift-confirm';
import { CompanyDetailPage } from '../company-detail/company-detail';
import { ReviewDetailPage } from '../review-detail/review-detail';

import { AppService } from '../../modules/common/services/app.service';
import { DataService } from '../../modules/common/services/data.service';

import { ViewStatusEnum } from '../../modules/common/models/enums';
import { IOffer, IUser } from '../../modules/common/models/interfaces';
import { ModelPage } from '../../modules/common/models/model-page';

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
    public actionSheet: ActionSheetController,
    public theApp: AppService,
    public dataService: DataService
  ) {
    super("Product Details");
    this.product = navParams.get('offer');
    this.bgImage = this.product.picture.cover;
  }

  ionViewWillEnter() {
    this.doReset(this.product.item.title);
    this.doChangeView(ViewStatusEnum.Loading);
    //this.load();
    let self = this;
    self.auth.getUser()
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

  changeViewState(b: boolean) {
    this.doChangeViewState(b);
    this.theApp.util.dismissLoading();
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
    self.theApp.util.presentLoading('Aguarde..');

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
      self.theApp.util.presentToast('Adicionado aos seus favoritos!');
    }, (err) => {
      console.log(err);
      self.theApp.util.dismissLoading();
      self.theApp.notifyError(err);
    });
  }

  removeFromList() {
    let self = this;
    self.theApp.util.presentLoading('Aguarde..');
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
      self.theApp.util.presentToast('Removido de seus favoritos!');
    }, (err) => {
      console.log(err);
      self.theApp.util.dismissLoading();
      self.theApp.notifyError(err);
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
    self.theApp.util.presentLoading('Aguarde..');

    review.ReviewFact.buyerId = self.user.buyer.buyerId;
    this.dataService.addSocialAction({
      controller: 'review-facts',
      data: review
    })
    .then((data) => {
      if(data['status'] == 200) {
        self.util.presentToast('Você ganhou '+data['credit']+' moedas pela avaliação. Obrigado!');
        //self.product.reviews.push(review);
        //this.dataService.creditUser(10);
        self.theApp.util.dismissLoading();
      }
    }, (err) => {
      console.log(err);
      self.theApp.notifyError(err);
      self.theApp.util.dismissLoading();
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
