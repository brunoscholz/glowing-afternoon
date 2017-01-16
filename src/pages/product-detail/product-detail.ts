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
import { NavController, NavParams, ModalController, PopoverController } from 'ionic-angular';
import { ModelPage } from '../model-page';
import { ReviewPage } from '../review/review';
import { CompanyDetailPage } from '../company-detail/company-detail';
import { ReviewDetailPage } from '../review-detail/review-detail';
import { DataService } from '../../providers/data/data.service';
import { AuthService } from '../../providers/auth/auth.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { ProductOptionsPage } from './product-options';

import { ViewStatusEnum } from '../../providers/utils/enums';
import { IOffer, IUser } from '../../providers/data/interfaces';
import _ from 'underscore';

@Component({
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage extends ModelPage {
  product: IOffer;
  bgImage: string;

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public modCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public dataService: DataService,
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

  moreOptions(myEvent) {
    let popover = this.popoverCtrl.create(ProductOptionsPage, { product: this.product });
    popover.onDidDismiss((act) => {
      if(act == 'addReview')
        this.addReview();
    });
    popover.present({
      ev: myEvent
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

    self.auth.getUserInfo()
    .then((user: IUser) => {

      review.ReviewFact.buyerId = user.buyer.buyerId;

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
    });
  }

  gotoCompany() {
    this.navCtrl.push(CompanyDetailPage, {
      company: this.product.seller
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
