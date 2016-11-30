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
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController, ModalController } from 'ionic-angular';
import { ModelPage } from '../model-page';
// import { ReviewPage } from '../review/review';
// import { ReviewDetailPage } from '../review-detail/review-detail';
import { DataService } from '../../providers/data/data.service';
import { LoadingService } from '../../providers/utils/loading.service';

import { ViewStatusEnum } from '../../providers/utils/enums';
import { ISeller, IOffer } from '../../providers/data/interfaces';
//import _ from 'underscore';

@Component({
  templateUrl: 'company-detail.html',
})
export class CompanyDetailPage extends ModelPage implements OnInit {
  company: ISeller;
  bgImage: string;
  offers: IOffer[];

  constructor(public navCtrl: NavController, navParams: NavParams, public alertCtrl: AlertController, public acCtrl: ActionSheetController, public modCtrl: ModalController, public dataService: DataService, public loading: LoadingService) {
    super("Company Details", dataService, loading);
    this.company = navParams.get('company');
    console.log(this.company);
    this.bgImage = 'http://ondetem.tk/' + this.company.picture.cover;
  }

  ngOnInit() {
    var self = this;
    this.dataService.catalog$
      .subscribe(
        (data) => {
          self.offers = data;
          self.changeViewState();
          if(self.refresher)
            self.refresher.complete();
        },
        (err) => { console.log(err); },
        () => {}
      );
  }

  ionViewWillEnter() {
    this.doReset(this.company.name);
    this.load();
    //this.doToggleLoading(false);
  }

  changeViewState() {
    if (this.company) {
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
    /*this.dataService.findAll({
      controller: 'sellers',
      query: { 'sellerId': this.company.sellerId }
    });*/
    this.dataService.getPretty({
      controller: 'catalog',
      url: 'sellers/catalog/' + this.company.sellerId
    });
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
