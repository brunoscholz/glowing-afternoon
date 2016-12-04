import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { IProfile, IReviewFact } from '../../providers/data/interfaces';
import { ModelPage } from '../model-page';
import { ViewStatusEnum } from '../../providers/utils/enums';
import _ from 'underscore';

@Component({
  selector: 'page-review-list',
  templateUrl: 'review-list.html'
})
export class ReviewListPage extends ModelPage implements OnInit {
	//user: IUser;
	reviews: IReviewFact[];
	profile: IProfile;

  constructor(public navCtrl: NavController,
  						navParams: NavParams,
							public dataService: DataService,
							public auth: AuthService,
							public util: UtilProvider
	) {
  	super('Avaliações', dataService, util);
  	this.profile = navParams.get('profile');
  }

  ngOnInit() {
  	var self = this;

    self.dataService.reviews$.subscribe((fws: IReviewFact[]) => {
      self.reviews = fws;
      this.changeViewState();
    });
  }

  ionViewDidLoad() {
    this.load();
  }

  changeViewState() {
    if (_.size(this.reviews) > 0) {
      this.doChangeView(ViewStatusEnum.Full);
    }
    else {
      this.doChangeView(ViewStatusEnum.Empty);
    }
    //this.doToggleLoading(false);
  }

  load() {
  	let self = this;

  	self.dataService.findAll({
      controller: 'review-facts',
      query: {'buyerId':{test:"like binary",value:this.profile.id}}
    });
  }
}
