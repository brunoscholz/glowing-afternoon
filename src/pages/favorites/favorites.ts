import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { IProfile, IFavoriteFact } from '../../providers/data/interfaces';
import { ModelPage } from '../model-page';
import { ViewStatusEnum } from '../../providers/utils/enums';
import _ from 'underscore';

@Component({
  templateUrl: 'favorites.html'
})
export class FavoritesPage extends ModelPage {
	favorites: Array<IFavoriteFact> = new Array<IFavoriteFact>();
	profile: IProfile;
  authTk: Array<any> = new Array<any>();

  constructor(public navCtrl: NavController,
  						navParams: NavParams,
							public dataService: DataService,
							public auth: AuthService,
							public util: UtilProvider
	) {
  	super('Favoritos', dataService, util);
    //this.color = 'primary';
  	this.profile = navParams.get('profile');
  }

  ionViewDidLoad() {
    this.load();
  }

  load() {
    this.query();
    //this.doQuery();
  }

  query(dontClear = false) {
    this.doChangeView(ViewStatusEnum.Loading);
    this.util.presentLoading('Buscando...');
    var self = this;
    self.dataService.findAll({
      controller: 'favorite-facts',
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

      self.changeViewState();
    }, (err) => {
      console.log(err);
    });
  }

  doQuery(dontClear = false) {
    var self = this;
    this.util.presentLoading('Buscando...');
    self.dataService.findAll({
      controller: 'auth-token',
      page: this.pageNum,
      limit: 5
    }).then((tks: Array<any>) => {
      if(dontClear) {
        if (_.size(tks) < 5)
          self.hasMore = false;

        self.authTk.push.apply(self.authTk, tks);
      } else {
        self.authTk = tks;
      }
      
      self.changeViewState();
    }, (err) => {
      console.log(err);
    });
  }

  changeViewState() {
    if (_.size(this.favorites) > 0) {
      this.doChangeView(ViewStatusEnum.Full);
    }
    else {
      this.doChangeView(ViewStatusEnum.Empty);
    }
    this.util.dismissLoading();
  }

  loadMore() {
    this.pageNum += 1;
    this.query(true);
  }
}

