import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { IProfile, IFollowFact } from '../../providers/data/interfaces';
import { ModelPage } from '../model-page';
import { ViewStatusEnum } from '../../providers/utils/enums';
import _ from 'underscore';

@Component({
  selector: 'page-follows',
  templateUrl: 'follows.html'
})
export class FollowsPage extends ModelPage implements OnInit {
	//user: IUser;
	follows: IFollowFact[];
	me: boolean;
	profile: IProfile;

  constructor(public navCtrl: NavController,
  						navParams: NavParams,
							public dataService: DataService,
							public auth: AuthService,
							public util: UtilProvider
	) {
  	super('Follow', dataService, util);
  	this.me = navParams.get('me');
  	this.profile = navParams.get('profile');
  }

  ngOnInit() {
  	var self = this;

    self.dataService.follows$.subscribe((fws: IFollowFact[]) => {
      self.follows = fws;
      this.changeViewState();
    });
  }

  ionViewDidLoad() {
  	let t = this.me ? 'Seguidores' : 'Seguindo';
  	this.doChangeTitle(t);
    this.load();
  }

  changeViewState() {
    if (_.size(this.follows) > 0) {
      this.doChangeView(ViewStatusEnum.Full);
    }
    else {
      this.doChangeView(ViewStatusEnum.Empty);
    }
    //this.doToggleLoading(false);
  }

  load() {
  	let self = this;

  	let query = {};
  	if(this.me) {
			if(this.profile.type == 'buyer')
  			query = {'buyerId':{test:"like binary",value:this.profile.id}};
  		else
  			query = {'sellerId':{test:"like binary",value:this.profile.id}};
  	}
  	else {
  		query = {'userId':{test:"like binary",value:this.profile.id}};
  	}

  	self.dataService.findAll({
      controller: 'follow-facts',
      query: query
    });
  }
}
