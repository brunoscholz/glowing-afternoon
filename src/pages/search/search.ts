import { Component } from '@angular/core'; // NgZone
import { NavController, NavParams } from 'ionic-angular'; //reorderArray

import { ProductDetailPage } from '../product-detail/product-detail';
import { CompanyDetailPage } from '../company-detail/company-detail';
import { UserDetailPage } from '../user-detail/user-detail';
import { ProfilePage } from '../profile/profile';

import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { AuthService } from '../../providers/auth/auth.service';

import { ViewStatusEnum } from '../../providers/utils/enums';
import { IUser, ISearchItems } from '../../providers/data/interfaces'; //ISearchResult
import { ModelPage } from '../model-page';
import 'rxjs/add/operator/debounceTime';
import _ from 'underscore';

@Component({
  templateUrl: 'search.html'
})
export class SearchPage extends ModelPage {
  searchTerm: string = '';
  searching: any = false;
  //priceRange: any = { lower: 10, upper: 200 };
  opt: any = { offers: true, sellers: true, buyers: true, priceRange: 100, lowerThan: true };
  searchOptions: any;

  user: any;
  following: any;

  // accordion test
  items: ISearchItems;

  constructor(public navCtrl: NavController,
              navParams: NavParams,
              public dataService: DataService,
              public auth: AuthService,
              public util: UtilProvider) {
    super('Busca', dataService, util)
  	this.searchTerm = navParams.get('term') || '';
    //this.searchControl = new Control();
  }

  ionViewDidLoad() {
    this.doReset('Busca');
    this.load();
  }

  toggleDetails(data) {
    if (data.showDetails) {
      data.showDetails = false;
      data.icon = 'ios-add-circle-outline';
    } else {
      data.showDetails = true;
      data.icon = 'ios-remove-circle-outline';
    }
  }

  load() {
    let self = this;
    this.doChangeView(ViewStatusEnum.Loading);
    this.util.presentLoading('Buscando...');

    this.auth.getUserInfo()
    .then((usr: IUser) => {
      if(usr) {
        self.user = usr;
        self.following = _.pluck(self.user.buyer.following, 'buyerId');
        self.doSearch();
      }
    }, (err) => {
      this.util.notifyError(err);
      this.util.dismissLoading();
    });
  }

  doSearch() {
    let self = this;
    // searchFor : {offers} -> offers only
    // searchFor : {offers, users} -> offers and users
    let searchFor = [];
    if(self.opt.offers)
      searchFor.push('offers');

    if(self.opt.sellers)
      searchFor.push('sellers');

    if(self.opt.buyers)
      searchFor.push('buyers');

    console.log(searchFor);

    self.dataService.search({
      term: self.searchTerm
    }).then((data: ISearchItems) => {
        self.items = data;
        self.changeViewState();
        if(self.refresher)
          self.refresher.complete();
      }, (err) => {
        self.util.notifyError(err);
        //this.util.dismissLoading();
        self.changeViewState();
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

    this.util.presentLoading('Buscando...');
    this.doSearch();
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
    if (item.buyerId == this.user.buyer.buyerId)
      this.navCtrl.setRoot(ProfilePage, { user: item });
    else
      this.navCtrl.push(UserDetailPage, { user: item });
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

  filterChange(e) {
    if(!e.target.checked) {
      // filter / search

    }
  }

  calculatePrice() {
    let ret = "";
    if(this.opt.priceRange == 0)
      ret = 'grátis';
    else if (this.opt.priceRange > 1 && this.opt.lowerThan)
      ret = 'até R$ ' + this.opt.priceRange;
    else if (this.opt.priceRange > 1 && !this.opt.lowerThan)
      ret = 'acima de R$ ' + this.opt.priceRange;

    return ret;
  }
}
