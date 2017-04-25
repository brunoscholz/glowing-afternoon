import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AppService } from '../../modules/common/services/app.service';
import { DataService } from '../../modules/common/services/data.service';

import { ViewStatusEnum } from '../../modules/common/models/enums';
import { IProfile, IFollowFact } from '../../modules/common/models/interfaces';
import { ModelPage } from '../../modules/common/models/model-page';

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

  constructor(
    public navCtrl: NavController,
		navParams: NavParams,
		public dataService: DataService,
		public theApp: AppService
	) {
  	super('Follow');
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
    this.theApp.util.presentLoading('Buscando...');

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
      this.changeViewState(true);
    }, (err) => {
      console.log(err);
    });
  }

  changeViewState(b: boolean) {
    this.doChangeViewState(b);
    this.theApp.util.dismissLoading();
  }

  userTapped(ev, buyer) {

  }
}
