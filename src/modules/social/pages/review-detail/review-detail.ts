/**
 * ReviewDetailPage class
 *
 * Detail information about one review of a product or a company
 * with all it's commentaries
 * 
 * It subscribes to dataService.reviews$ and on change
 * it loads the results into the @property review based on the query
 * in the load method
 *
*/

import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { AppService } from '../../../common/services/app.service';
import { DataService } from '../../../common/services/data.service';

import { ViewStatusEnum } from '../../../common/models/enums';
import { ModelPage } from '../../../common/pages/model-page';

//import _ from 'underscore';

@Component({
  templateUrl: 'review-detail.html',
})
export class ReviewDetailPage extends ModelPage {
	product: any;
  fact: any;

  constructor(
    public navCtrl: NavController, 
    navParams: NavParams,
    public viewCtrl: ViewController,
    public theApp: AppService,
    public dataService: DataService
  ) {
  	super('Review');
  	this.fact = navParams.get('review');
  	this.product = navParams.get('product');
  }

  ionViewWillEnter() {
    this.doReset('Review');
    this.changeViewState(false);
    this.load();
  }

  load() {
    //var self = this;
    //this.doChangeView(ViewStatusEnum.Empty);
    //this.util.presentLoading('Buscando...');
    //this.dataService.getComments({ collectionName: 'factSocial', query: { reviewId: this.review.data._id } })
    //this.dataService.findAllComments({ query: { reviewId: this.review.id } });
  }

  changeViewState(b: boolean) {
    this.doChangeViewState(b);
    //this.theApp.util.dismissLoading();
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.load();
  }

  gotoUser(id) {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
