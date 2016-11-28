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
import { DataService } from '../../providers/services/data.service';
import { LoadingService } from '../../providers/services/loading.service';

import { ViewStatusEnum } from '../../providers/enums';
import { ModelPage } from '../model-page';

//import { IReview, IComment } from '../../providers/interfaces';

import _ from 'underscore';

@Component({
  templateUrl: 'review-detail.html',
})
export class ReviewDetailPage extends ModelPage {
	product: any;
  review: any;

  constructor(
  	public navCtrl: NavController, 
  	navParams: NavParams,
  	public viewCtrl: ViewController,
    public dataService: DataService, 
    public loading: LoadingService
  ) {
  	super('Review', dataService, loading)
  	this.review = navParams.get('review');
  	this.product = navParams.get('product');
  	_.extend(this.review, { comments: [] });
  }

  ngOnInit() {
  	var self = this;
  	this.dataService.comments$
	    .subscribe(
	      (data) => {
	      	console.log(data);
	      	self.review.comments = data;
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
    this.doReset('Review');
    this.load();
  }

  changeViewState() {
    if (_.size(this.data.comments) > 0) {
      this.doChangeView(ViewStatusEnum.Full);
    }
    else {
      this.doChangeView(ViewStatusEnum.Empty);
    }
    this.loading.toggleLoadingIndicator(false);
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.load();
  }

  load() {
  	//this.dataService.getComments({ collectionName: 'factSocial', query: { reviewId: this.review.data._id } })
    //this.dataService.findAllComments({ query: { reviewId: this.review.id } });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
