import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { IProfile, IFollowFact } from '../../providers/data/interfaces';
import { ModelPage } from '../model-page';
import { ViewStatusEnum } from '../../providers/utils/enums';
import _ from 'underscore';

@Component({
  templateUrl: 'follows.html'
})
export class FollowsPage extends ModelPage {
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

  ionViewDidLoad() {
  	let t = this.me ? 'Seguidores' : 'Seguindo';
  	this.doChangeTitle(t);
    this.load();
  }

  load() {
    var self = this;
    this.doChangeView(ViewStatusEnum.Loading);
    this.util.presentLoading('Buscando...');

    let query = {};
    if(this.me) {
      if(this.profile.type == 'buyer')
        query = {'buyerId':{test:"like binary",value:this.profile.id}};
      else
        query = {'sellerId':{test:"like binary",value:this.profile.id}};
    }
    else {
      query = {'userId':{test:"like binary",value:this.profile.id}, "buyerId":{test:"<>",value:"NULL"}};
    }

    self.dataService.findAll({
      controller: 'follow-facts',
      query: query
    }).then((fws: IFollowFact[]) => {
      self.follows = fws;
      this.changeViewState();
    }, (err) => {
      console.log(err);
    });
  }

  changeViewState() {
    if (_.size(this.follows) > 0) {
      this.doChangeView(ViewStatusEnum.Full);
    }
    else {
      this.doChangeView(ViewStatusEnum.Empty);
    }
    this.util.dismissLoading();
  }

  userTapped(ev, buyer) {

  }
}
