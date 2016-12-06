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
import { NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
import { ModelPage } from '../model-page';
// import { ReviewPage } from '../review/review';
// import { ReviewDetailPage } from '../review-detail/review-detail';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { ViewStatusEnum } from '../../providers/utils/enums';
import { ISeller, IOffer } from '../../providers/data/interfaces';
//import _ from 'underscore';

@Component({
  templateUrl: 'company-detail.html',
})
export class CompanyDetailPage extends ModelPage {
  company: ISeller;
  bgImage: string;
  offers: IOffer[];

  constructor(public navCtrl: NavController,
              navParams: NavParams,
              public acCtrl: ActionSheetController,
              public modCtrl: ModalController,
              public dataService: DataService,
              public util: UtilProvider
  ) {
    super("Company Details", dataService, util);
    this.company = navParams.get('company');
    console.log(this.company);
    this.bgImage = 'http://ondetem.tk/' + this.company.picture.cover;
  }

  ionViewDidLoad() {
    this.doReset(this.company.name);
    this.load();
  }

  load() {
    var self = this;
    this.doChangeView(ViewStatusEnum.Empty);
    this.util.presentLoading('Buscando...');

    this.dataService.getPretty({
      controller: 'catalog',
      url: 'sellers/catalog/' + self.company.sellerId
    }).then((data: Array<IOffer>) => {
      self.offers = data;
      self.changeViewState();
      if(self.refresher)
        self.refresher.complete();
    }, (err) => {
      console.log(err);
    });
  }

  changeViewState() {
    if (this.company) {
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

  like(event) {
    /*this.dataService.like(this.company).subscribe(
        likes => {
          this.company.likes = likes;
        }
    );*/
  }

  share(event, company) {
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

  addReview(){
    /*let modal = this.modCtrl.create(ReviewPage, { item: this.company });
    modal.onDidDismiss(review => {
      if(review){
        this.company.reviews.push(review);
        this.dataService.addReview(review);
      }
    });

    modal.present();*/
  }

  deleteReview(review){
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
