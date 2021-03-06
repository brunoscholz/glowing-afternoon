import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AppService } from '../../../common/services/app.service';
import { SocialService } from '../../services/social.service';

import { ViewStatusEnum } from '../../../common/models/enums';
import { IOffer, IProfile, IReviewFact } from '../../../common/models/interfaces';
import { ModelPage } from '../../../common/pages/model-page';

import _ from 'underscore';

@Component({
  selector: 'page-review-list',
  templateUrl: 'review-list.html'
})
export class ReviewListPage extends ModelPage {
	//user: IUser;
	reviews: IReviewFact[];
	profile: IProfile;
  offer: IOffer;

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public theApp: AppService,
    public socialService: SocialService
	) {
  	super('Avaliações');
  	this.profile = navParams.get('profile');
    this.offer = navParams.get('offer');
  }

  ionViewDidLoad() {
    this.load();
  }

  load() {
  	var self = this;
    this.doChangeView(ViewStatusEnum.Loading);
    this.theApp.util.presentLoading('Buscando...');

    var q = {};
    if(this.profile == null)
      q = {'offerId':{ test:"like binary", value:this.offer.offerId}};
    else if (this.offer == null)
      q = {'buyerId':{ test:"like binary", value:this.profile.id}};

  	self.socialService.getReviews({
      query: q
    }).then((fws: IReviewFact[]) => {
    	self.reviews = fws;
      this.changeViewState(_.size(self.reviews) > 0);
    }, (err) => {
    	console.log(err);
    });
  }

  changeViewState(b: boolean) {
    this.doChangeViewState(b);
    this.theApp.util.dismissLoading();
  }
}
