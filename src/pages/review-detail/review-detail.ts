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
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { ViewStatusEnum } from '../../providers/utils/enums';
import { ModelPage } from '../model-page';

//import { IReview, IComment } from '../../providers/interfaces';

//import _ from 'underscore';

@Component({
  templateUrl: 'review-detail.html',
})
export class ReviewDetailPage extends ModelPage {
	product: any;
  fact: any;

  constructor(public navCtrl: NavController, 
            	navParams: NavParams,
            	public viewCtrl: ViewController,
              public dataService: DataService, 
              public util: UtilProvider
  ) {
  	super('Review', dataService, util)
  	this.fact = navParams.get('review');
  	this.product = navParams.get('product');
  }

  ionViewWillEnter() {
    this.doReset('Review');
    this.changeViewState();
    this.load();
  }

  load() {
    //var self = this;
    //this.doChangeView(ViewStatusEnum.Empty);
    //this.util.presentLoading('Buscando...');
    //this.dataService.getComments({ collectionName: 'factSocial', query: { reviewId: this.review.data._id } })
    //this.dataService.findAllComments({ query: { reviewId: this.review.id } });
  }

  changeViewState() {
    if (this.fact) {
      this.doChangeView(ViewStatusEnum.Full);
    }
    else {
      this.doChangeView(ViewStatusEnum.Empty);
    }
    this.util.dismissLoading();
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.load();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
