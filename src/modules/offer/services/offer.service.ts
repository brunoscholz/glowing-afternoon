import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { ICategory, IOffer } from '../../common/models/interfaces';
import { Helper } from '../../common/services/helper.service';
import { ApiService } from '../../common/services/api.service';

import { Data } from '../../common/models/data.model';

//import { AppService } from '../../common/services/app.service';
//import { UserService } from '../../user/services/user.service';

import _ from 'underscore';

@Injectable()
export class OfferService {
  _categories: Data;
  _offers: Data;
  _offer: Data;
  randomArray = ["encanador", "restaurante", "sapatos", "maquiagem", "website"];

  get randomProduct() { return "ex.: " + this.randomArray[Math.floor(Math.random() * this.randomArray.length)]; }

  constructor(
    public events: Events,
    private helper: Helper,
    public api: ApiService
  ) {
    this._categories = new Data();
    this._offers = new Data();
    this._offer = new Data();
  }

  search(query) {
    let url: string = this.helper.getAPI('search');

    return this.api.get(url, query)
    .catch(this.handleError);
  }

  getCategories(options: any) {
    let self = this;
    let url: string = self.helper.getAPI('categories');

    if (_.size(self._categories.value) > 0) {
      return self.cachedCategories();
    }

    /*if (data['randCat'] != null) {
      this._cached$['randomProduct'] = data['randCat'];
      console.log(data['randCat']);
    }*/

    return self.api.get(url, options, true)
    .then((res) => {
      let cats = res['data'];
      self._categories.set<ICategory>(cats);
      return self.cachedCategories();
    })
    .catch(self.handleError);
  }

  cachedCategories() {
    let self = this;
    return Observable.create(observer => {
      observer.next(<ICategory[]>self._categories.value);
      observer.complete();
    })
    .toPromise()
    .catch(self.handleError);
  }

  getCatalog(options: any) {
    let url: string = this.helper.getAPI('sellers/catalog');
    let id = options.sellerId || '';
    url = url + '/' + id;

    return this.api.get(url, {})
    .catch(this.handleError);
  }

  // get vouchers
  getVouchers(options: any) {
    let self = this;
    let uri = options.controller || 'offers/vouchers';
    let url: string = self.helper.getAPI(uri);

    return self.api.get(url, options, true)
    .then((res) => {
      let off = res['data'];
      //self._offers.set<IOffer>(off);
      return off;
    })
    .catch(self.handleError);
  }

  getMyVouchers(options: any) {
    let self = this;
    let url: string = self.helper.getAPI('relationships/vouchers');
    let id = options.buyerId || '';
    if(id != '' && id != undefined)
      url = url + '/' + id;

    return self.api.get(url, {})
    /*.then((res) => {
      let off = res['data'];
      //self._offers.set<IOffer>(off);
      return off;
    })*/
    .catch(self.handleError);
  }

  buyVoucher(options: any) {
    let self = this;
    let url: string = self.helper.getAPI('relationships/buy-voucher');

    return self.api.post(url, options.data)
    .catch(self.handleError);
  }

  consumeVoucher(options: any) {
    let self = this;
    let url: string = self.helper.getAPI('relationships/consume-voucher');

    return self.api.post(url, options.data)
    .catch(self.handleError);
  }

  // get offers
  getOffers(options: any, clear: boolean = false, single: boolean = false) {
    let self = this;
    let uri = options.controller || 'offers';
    let url: string = self.helper.getAPI(uri);

    if (clear)
      self._offers.clear();

    /*console.log(_.size(self._offers.value));
    console.log(self._offers.isUpToDate());*/
    if (_.size(self._offers.value) > 0 && !self._offers.isUpToDate()) {
      return self.cachedOffers();
    }

    return self.api.get(url, options, true)
    .then((res) => {
      let off = res['data'];
      if (single) {
        self._offer.set<IOffer>(off[0]);
        return self.cachedOffer();
      }
      else {
        self._offers.set<IOffer>(off);
        return self.cachedOffers();
      }
    })
    .catch(self.handleError);
  }

  cachedOffers() {
    let self = this;
    return Observable.create(observer => {
      observer.next(<IOffer[]>self._offers.value);
      observer.complete();
    })
    .toPromise()
    .catch(self.handleError);
  }

  cachedOffer() {
    let self = this;
    return Observable.create(observer => {
      observer.next(<IOffer>self._offer.value);
      observer.complete();
    })
    .toPromise()
    .catch(self.handleError);
  }

  setOffer(off: IOffer) {
    this._offer.set<IOffer>(off);
  }

  getOffer(options: any, clear: boolean = false) {
    let self = this;

    if (clear)
      self._offer.clear();

    if (_.size(self._offer.value) > 0 && !self._offer.isUpToDate()) {
      return Observable.create(observer => {
        observer.next(<IOffer>self._offer.value);
        observer.complete();
      })
      .toPromise()
      .catch(self.handleError);
    }

    return self.getOffers(options, false, true);
  }

  // handle error
  private handleError(error: any) {
    return Promise.reject(error.message || error);
  }
}
