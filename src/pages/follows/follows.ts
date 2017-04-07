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
  followers: IFollowFact[];
  following: IFollowFact[];

	profile: IProfile;
  followtabs:string = 'followers';

  constructor(public navCtrl: NavController,
  						navParams: NavParams,
							public dataService: DataService,
							public auth: AuthService,
							public util: UtilProvider
	) {
  	super('Follow', dataService, util);
  	this.profile = navParams.get('profile');
  }

  ionViewDidLoad() {
  	let t = this.followtabs == 'followers' ? 'Seguidores' : 'Seguindo';
  	this.doChangeTitle(t);
    this.load();
  }

  load() {
    var self = this;
    this.doChangeView(ViewStatusEnum.Loading);
    this.util.presentLoading('Buscando...');

    let query = {};
    
    if(this.profile.type == 'buyer')
      query = {'userId':{test:"like binary",value:this.profile.id}};
    else
      query = {'userId':{test:"like binary",value:this.profile.id},profile:"seller"};

    self.dataService.findAll({
      controller: 'follow-facts',
      query: query
    }).then((fws: any[]) => {
      self.followers = <IFollowFact[]>fws['followers'];
      self.following = <IFollowFact[]>fws['following'];
      console.log(self.followers);
      console.log(self.following);
      this.changeViewState();
    }, (err) => {
      console.log(err);
    });
  }

  changeViewState() {
    if (_.size(this.followers) > 0 || _.size(this.following) > 0) {
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
