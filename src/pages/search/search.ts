import { Component } from '@angular/core'; // NgZone
import { NavController, NavParams } from 'ionic-angular'; //reorderArray

import { ProductDetailPage } from '../product-detail/product-detail';
import { CompanyDetailPage } from '../company-detail/company-detail';
import { UserDetailPage } from '../user-detail/user-detail';
import { ProfilePage } from '../profile/profile';

import { MapService } from '../../modules/maps/services/map.service';
import { GeocoderService } from '../../modules/maps/services/geocoder.service';

import { AppService } from '../../modules/common/services/app.service';
import { DataService } from '../../modules/common/services/data.service';

import { ViewStatusEnum } from '../../modules/common/models/enums';
import { IUser, ISearchItems } from '../../modules/common/models/interfaces'; //ISearchResult
import { ModelPage } from '../../modules/common/models/model-page';
import 'rxjs/add/operator/debounceTime';
import _ from 'underscore';

@Component({
  templateUrl: 'search.html'
})
export class SearchPage extends ModelPage {
  searchTerm: string = '';
  searching: any = false;
  //priceRange: any = { lower: 10, upper: 200 };
  opt: any = { offers: true, sellers: true, buyers: true, priceRange: 100, lowerThan: true, distance: 25 };
  searchOptions: any;

  user: any;
  following: any;

  items: ISearchItems;
  allItems: ISearchItems;

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public theApp: AppService,
    public dataService: DataService,
    public geocoderService: GeocoderService,
    public mapService: MapService
  ) {
    super('Busca')
  	this.searchTerm = navParams.get('term') || '';
    //this.searchControl = new Control();
  }

  ionViewDidLoad() {
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
    self.theApp.util.presentLoading();

    this.theApp.authService.getUser()
    .then((usr: IUser) => {
      if(usr) {
        self.user = usr;
        self.following = _.pluck(self.user.buyer.following, 'buyerId');
        self.prepareFilter();
        self.doSearch();
      }
    }, (err) => {
      this.theApp.notifyError(err);
      self.changeViewState(false);
    });
  }

  prepareFilter() {
    let self = this;
    self.mapService.getCurrentPosition()
    .then((coord) => {
      self.geocoderService.fullAddressForlatLng(coord.latitude, coord.longitude)
      .subscribe((address) => {
        let latlng = {
          city: "",
          latitude: address.geometry.location.lat(),
          longitude: address.geometry.location.lng()
        };
        _.each(address.address_components, (component, key) => {
          if (component.types[0] === 'locality') {
            latlng.city = component.long_name;
          }
        });

        console.log(latlng);
      }, (error) => {
        //self.displayErrorAlert();
        console.error(error);
      });
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

    self.dataService.search({
      query: self.searchTerm
    }).then((data: ISearchItems) => {
        self.allItems = data;
        let latlng = { lat: -25.4709161, lng:-49.24417260000001 };
        self.allItems.sellers.list = this.mapService.applyHaversineSeller(self.allItems.sellers.list, latlng);
        self.allItems.sellers.list.sort((locationA, locationB) => {
            return locationA.distance - locationB.distance;
        });
        self.filterItems();
        self.changeViewState(_size(self.allItems) > 0);
        /*if(self.refresher)
          self.refresher.complete();*/
      }, (err) => {
        self.theApp.util.notifyError(err);
        self.theApp.util.dismissLoading();
        self.changeViewState(false);
      });
  }

  changeViewState(b: boolean) {
    this.doChangeViewState(b);
    this.theApp.util.dismissLoading();
  }

  doRefresh(refresher) {
    this.load();
  }

  onInput() {
    if(this.searchTerm == '')
      return;

    self.theApp.util.presentLoading();
    this.doSearch();
  }

  doIFollow(event, id) {
    if(_.contains(this.following, id))
      return true;

    return false;
  }

  onCancel() {

  }

  filterItems() {
    // if the value is an empty string don't filter the items
    this.items = this.allItems;
    this.items.sellers.list = this.allItems.sellers.list.filter((item) => {
      return (item.distance <= this.opt.distance);
    });
  }

  initializeItems() {
    //let test = _.groupBy(this.items, 'category');

    this.doChangeView(ViewStatusEnum.Empty);
    /*this.groupedOffers = [];
    for (var key in test) {
      let cat = this.dataService.getCategory({ id: Number(key) });
      let entry = { category: cat, items: test[key] };
      this.groupedOffers.push(entry);
    }*/
    this.changeViewState(false);
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
