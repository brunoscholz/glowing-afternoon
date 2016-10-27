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
import { MockDataService } from '../../providers/services/mockdata.service';
import { LoadingService } from '../../providers/services/loading.service';
import { LoadingModal } from '../../components/loading-modal/loading-modal';

import { ViewStatusEnum } from '../../providers/enums';
//import { IProductFact, IProduct, IReviewFact, IReview } from '../../providers/interfaces';
import _ from 'underscore';

@Component({
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage extends ModelPage implements OnInit {
  product: any;
  visitingCompany: string = '';

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public acCtrl: ActionSheetController,
    public modCtrl: ModalController,
    public dataService: MockDataService,
    public loading: LoadingService) {
    super("Product Details", dataService, loading);
    this.product = navParams.get('item');
    _.extend(this.product, { reviews: [] });

    this.visitingCompany = dataService.getVisitingCompany();
  }

  ngOnInit() {
    var self = this;
    this.dataService.reviews$
      .subscribe(
        (data) => {
          self.product.reviews = data;
          self.changeViewState();
          if(self.refresher)
            self.refresher.complete();
        },
        (err) => { console.log(err); },
        () => {
        }
      );    

  }

  ionViewWillEnter() {
    this.doReset(this.product.title);
    this.load();
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
    //this.dataService.getReviews({ collectionName: 'factReview', query: { productId: this.product.data._id } })
    this.dataService.findAllReviews({ query: { item: this.product.sku } });
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

  share(event, product) {
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

  goToCompany() {
    this.navCtrl.push(CompanyDetailPage, {
      item: this.visitingCompany
    });
  }

  deleteReview(review){
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
}
