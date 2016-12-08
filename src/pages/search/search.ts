import { Component } from '@angular/core'; // NgZone
import { NavController, NavParams } from 'ionic-angular'; //reorderArray

import { ProductDetailPage } from '../product-detail/product-detail';
import { CompanyDetailPage } from '../company-detail/company-detail';
import { UserDetailPage } from '../user-detail/user-detail';

import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { AuthService } from '../../providers/auth/auth.service';

import { ViewStatusEnum } from '../../providers/utils/enums';
import { IUser } from '../../providers/data/interfaces';
import { ModelPage } from '../model-page';
import 'rxjs/add/operator/debounceTime';
import _ from 'underscore';

@Component({
  templateUrl: 'search.html'
})
export class SearchPage extends ModelPage {
  user: any;
  following: any;
  searchTerm: string = '';
  items: any = [];
  //groupedOffers: any = [];

  constructor(public navCtrl: NavController,
              navParams: NavParams,
              public dataService: DataService,
              public auth: AuthService,
              public util: UtilProvider) {
    super('Busca', dataService, util)
  	this.searchTerm = navParams.get('term') || '';
  }

  ionViewDidLoad() {
    this.doReset('Busca');
    this.load();
  }

  load() {
    let self = this;
    this.doChangeView(ViewStatusEnum.Empty);
    this.util.presentLoading('Buscando...');

    this.auth.loadUserCredentials().then((usr: IUser) => {
      if(usr) {
        self.user = usr;
        self.following = _.pluck(self.user.buyer.following, 'buyerId');
        self.doSearch();
      }
    }, (err) => {
      console.log(err);
    });
  }

  doSearch() {
    let self = this;
    // searchFor : {offers} -> offers only
    // searchFor : {offers, users} -> offers and users
    this.dataService.search({ term: this.searchTerm })
      .then((data) => {
        self.items = data;
        self.changeViewState();
        if(self.refresher)
          self.refresher.complete();
      }, (err) => {
        console.log(err);
      });
  }

  changeViewState() {
    if (_.size(this.items) > 0) {
      this.doChangeView(ViewStatusEnum.Full);
    }
    else {
      this.doChangeView(ViewStatusEnum.Empty);
    }
    this.util.dismissLoading();
  }

  doRefresh(refresher) {
    this.load();
  }

  onInput() {
    if(this.searchTerm == '')
      return;

    console.log(this.searchTerm);
  }

  doIFollow(event, id) {
    if(_.contains(this.following, id))
      return true;

    return false;
  }

  onCancel() {

  }

  getItems(ev: any) {
    // set val to the value of the searchbar
    //let val = ev.target.value;
    //this.filterItems(val);
  }

  reorderItems(indexes) {
    // reorder="true" (ionItemReorder)="reorderItems($event)"
    //this.items = reorderArray(this.items, indexes);
  }

  itemTapped(event, item) {
    this.navCtrl.push(ProductDetailPage, {
      offer: item
    });
  }

  userTapped(event, item) {
    this.navCtrl.push(UserDetailPage, {
      user: item
    });
  }

  tapFollow(event, item) {
    /*this.dataService.follow({

    });*/
  }

  companyTapped(event, item) {
    this.navCtrl.push(CompanyDetailPage, {
      company: item
    });
  }
}
