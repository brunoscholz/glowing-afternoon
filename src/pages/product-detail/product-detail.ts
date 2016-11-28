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

import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController, ModalController, ToastController } from 'ionic-angular';
import { ModelPage } from '../model-page';
import { ReviewPage } from '../review/review';
import { CompanyDetailPage } from '../company-detail/company-detail';
//import { ReviewDetailPage } from '../review-detail/review-detail';
import { DataService } from '../../providers/services/data.service';
import { LoadingService } from '../../providers/services/loading.service';

import { ViewStatusEnum } from '../../providers/enums';
import { IOffer } from '../../providers/interfaces';
import _ from 'underscore';

@Component({
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage extends ModelPage implements OnInit {
  product: IOffer;
  bgImage: string;

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public acCtrl: ActionSheetController,
    public modCtrl: ModalController,
    public dataService: DataService,
    public loading: LoadingService
  ) {
    super("Product Details", dataService, loading);
    this.product = navParams.get('offer');
    this.bgImage = 'http://ondetem.tk/' + this.product.picture.cover;
  }

  ngOnInit() {
    var self = this;
    /*this.dataService.offers$
      .subscribe(
        (data) => {
          self.product = data[0];
          self.changeViewState();
          if(self.refresher)
            self.refresher.complete();
        },
        (err) => { console.log(err); },
        () => {
        }
      );*/
  }

  ionViewWillEnter() {
    this.doReset(this.product.item.title);
    this.doToggleLoading(false);
    //this.load();
  }

  changeViewState() {
    if (_.size(this.product.reviews) > 0) {
      this.doChangeView(ViewStatusEnum.Full);
    }
    else {
      this.doChangeView(ViewStatusEnum.Empty);
    }
    this.doToggleLoading(false);
  }

  doRefresh(refresher) {
    //this.refresher = refresher;
    this.load();
  }

  load() {
    // redo the offer api call by this.product.offerId
    this.dataService.findAll({
      controller: 'offers',
      query: { 'offerId': this.product.offerId }
    });
  }

  favorite(event) {
    // this.dataService.favorite(this.product).subscribe(
    //   favorites => {
        let alert = this.alertCtrl.create({
            title: 'Favorites',
            subTitle: 'Product added to your favorites',
            buttons: ['OK']
        });
        alert.present();
    //   }
    // );
  }

  like(event) {
    /*this.dataService.like(this.product).subscribe(
        likes => {
          this.product.likes = likes;
        }
    );*/
  }

  share(event) {
    let actionSheet = this.acCtrl.create({
      buttons: [
        {
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
          text: 'Facebook',
          handler: () => {
            console.log('Facebook clicked');
          }
        },
        {
          text: 'Twitter',
          handler: () => {
            console.log('Twitter clicked');
          }
        },
        {
          text: 'Cancel',
          style: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  addReview() {
    let modal = this.modCtrl.create(ReviewPage, { item: this.product });
    modal.onDidDismiss(review => {
      if(review){
        this.product.reviews.push(review);
        this.dataService.addReview(review);
        this.presentToast();
      }
    });

    modal.present();
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Você ganhou 10 moedas pela avaliação. Obrigado!',
      position: 'middle',
      showCloseButton: true,
      closeButtonText: "Ok",
      cssClass: 'coin-toast'
    });

    toast.onDidDismiss(() => {
      this.dataService.creditUser(10);
    });

    toast.present();
  }

  gotoCompany() {
    this.navCtrl.push(CompanyDetailPage, {
      company: this.product.seller
    });
  }

  deleteReview(review) {
    //Remove locally
    let index = this.product.reviews.indexOf(review);
    if(index > -1){
      this.product.reviews.splice(index, 1);
    }
    //Remove from database
    //this.reviewService.deleteReview(review._id);
  }

  reviewTapped(event, item) {
    /*this.navCtrl.push(ReviewDetailPage, {
      review: item,
      product: this.product
    });*/
  }

  getRating(rate) {
    // let rate = this.rating + this.attendance * 1000 + this.price * 100;
    let decimal = rate - (Math.floor(rate / 100) * 100);
    return decimal;
  }

  hasField(field: any) {
    if (_.size(field) > 0)
      return true;

    return false;
  }
}
