import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { ICategory } from '../../common/models/interfaces';
import { Helper } from '../../common/services/helper.service';
import { ApiService } from '../../common/services/api.service';
//import { AppService } from '../../common/services/app.service';
//import { UserService } from '../../user/services/user.service';

import _ from 'underscore';

@Injectable()
export class OfferService {
  categories_cache: ICategory[];
  randomArray = ["encanador", "restaurante", "sapatos", "maquiagem", "website"];

  get randomProduct() { return "ex.: " + this.randomArray[Math.floor(Math.random() * this.randomArray.length)]; }

  constructor(
    public events: Events,
    private helper: Helper,
    public api: ApiService
  ) {
    
  }

  search(query) {
    let url: string = this.helper.getAPI('search');

    return this.api.get(url, query)
    .catch(this.handleError);
  }

  getCategories(options: any) {
    let self = this;
    let url: string = self.helper.getAPI('categories');

    if (_.size(self.categories_cache) > 0) {
      return self.cachedCategories();
    }

    /*if (data['randCat'] != null) {
      this._cached$['randomProduct'] = data['randCat'];
      console.log(data['randCat']);
    }*/

    return self.api.get(url, options, true)
    .then((res) => {
      let cats = res['data'];
      self.categories_cache = cats;
      return self.cachedCategories();
    })
    .catch(self.handleError);
  }

  cachedCategories() {
    let self = this;
    return Observable.create(observer => {
      observer.next(self.categories_cache);
      observer.complete();
    })
    .toPromise()
    .catch(self.handleError);
  }

  getCatalog(options: any) {
    let url: string = this.helper.getAPI('seller/catalog');

    url = url + options.sellerId;
    return this.api.get(url, {})
    .catch(this.handleError);
  }

  // get offers
  getOffers(options: any) {
    let uri = options.controller || 'offers';
    let url: string = this.helper.getAPI(uri);

    return this.api.get(url, options)
    .catch(this.handleError);
  }

  // handle error
  private handleError(error: any) {
    return Promise.reject(error.message || error);
  }
}
