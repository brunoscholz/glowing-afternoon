import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AppService } from '../../../common/services/app.service';
import { SocialService } from '../../services/social.service';
//import { UserService } from '../../services/user.service';

import { ViewStatusEnum } from '../../../common/models/enums';
import { IProfile, IFavoriteFact } from '../../../common/models/interfaces';
import { ModelPage } from '../../../common/pages/model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'favorites.html'
})
export class FavoritesPage extends ModelPage {
	favorites: Array<IFavoriteFact> = new Array<IFavoriteFact>();
	profile: IProfile;
  authTk: Array<any> = new Array<any>();

  constructor(
    public navCtrl: NavController,
		navParams: NavParams,
		public socialService: SocialService,
		public theApp: AppService
	) {
  	super('Favoritos');
    //this.color = 'primary';
  	this.profile = navParams.get('profile');
  }

  ionViewDidLoad() {
    this.load();
  }

  load() {
    this.query();
  }

  query(dontClear = false) {
    this.doChangeView(ViewStatusEnum.Loading);
    this.theApp.util.presentLoading('Buscando...');
    var self = this;
    self.socialService.getFavorites({
      query: {'buyerId':{test:"like binary",value:self.profile.id}},
      page: this.pageNum,
      limit: 10
    }).then((fws: Array<IFavoriteFact>) => {
      if(dontClear) {
        if (_.size(fws) < 10 || self.pageNum <= 1)
          self.hasMore = false;
        else
          self.hasMore = true;

        self.favorites.push.apply(self.favorites, fws);
      } else {
        self.favorites = fws;
      }

      self.changeViewState(true);
    }, (err) => {
      console.log(err);
    });
  }

  changeViewState(b: boolean) {
    this.doChangeViewState(b);
    this.theApp.util.dismissLoading();
  }

  loadMore() {
    this.pageNum += 1;
    this.query(true);
  }
}

