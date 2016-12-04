import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { IProfile, IFavoriteFact } from '../../providers/data/interfaces';
import { ModelPage } from '../model-page';
import { ViewStatusEnum } from '../../providers/utils/enums';
import _ from 'underscore';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage extends ModelPage implements OnInit {
	//user: IUser;
	favorites: IFavoriteFact[];
	profile: IProfile;

  constructor(public navCtrl: NavController,
  						navParams: NavParams,
							public dataService: DataService,
							public auth: AuthService,
							public util: UtilProvider
	) {
  	super('Favoritos', dataService, util);
  	this.profile = navParams.get('profile');
  }

  ngOnInit() {
  	var self = this;

    self.dataService.favorites$.subscribe((fws: IFavoriteFact[]) => {
      self.favorites = fws;
      this.changeViewState();
    });
  }

  ionViewDidLoad() {
    this.load();
  }

  changeViewState() {
    if (_.size(this.favorites) > 0) {
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
      controller: 'favorite-facts',
      query: {'buyerId':{test:"like binary",value:this.profile.id}}
    });
  }
}

