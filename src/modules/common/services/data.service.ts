import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Storage } from '@ionic/storage';

import { Observable, Observer } from 'rxjs/Rx';
import 'rxjs/Rx';

import { IUser, ISeller, ICategory } from '../models/interfaces';
import { Helper } from './helper.service';
import { ApiService } from './api.service';

import _ from 'underscore';

/*
API
results always come with status and result count

controller: the controller or collection wanted
  its included in the url (v1/controller)

q: query
  general filtering with table's fields

f: setOfFields
  set of fields to look for (select)
  setOfFields: [ field1, field2, field3, fieldN ]

fo: findOne
  return just one row
  findOne: true

s: sort
o: order
  orderBy order (ASC or DESC)
  orderBy fields
  sort: { field: fieldName, order: ascOrDesc }

pg: page
  used for pagination or infinite loading in sequence
  page: 2

l: limit
  limit: 10

ft: from-to filters
  fromto: [ { field: fieldName, low: lowValue, high: highValue } ]
*/

@Injectable()
export class DataService {
  private _subjects$: any;
  private _cached$: any;
  private _toStorage: any = ['loggedUser', 'categories', 'visitingCompany'];
  balance$: Observable<any>;
  visitingCompany: ISeller;

  get randomProduct() { return "ex.: " + this._cached$["randomProduct"]; }

  constructor(
    public api: ApiService,
    public helper: Helper,
    public storage: Storage
  ) {
    this._subjects$ = {};

    this.balance$ = Observable.create((observer:Observer<any>) => {
      this._subjects$['loyalty'] = observer;
    }).share();

    this._cached$ = {
      categories: null,
      randomProduct: 'encanador'
    };
  }

  loadMinimum() {
    // this.findAll({ collectionName: 'dimCategory', sortOrder: { code: 1 } }),
    // this.findAll({ collectionName: 'action' }),
    // this.findAll({ collectionName: 'dimDate' })
    /*this.api.findAll({ controller: 'categories', query: { parentId: 0 } })
      .map((res: Response) => res.json())
      .subscribe((cats) => {
        this._categories = cats;
      });*/
  }

  creditUser(coins) {
    console.log(coins);
  }

  setVisitingCompany(cp) {
    //this.storageSave('visitingCompany', JSON.stringify(cp));
    this.visitingCompany = cp;
    //window.localStorage.setItem('visitingCompany', JSON.stringify(cp));
  }

  getVisitingCompany() {
    return this.visitingCompany;
    //return JSON.parse(window.localStorage.getItem('visitingCompany'));
  }

  updateProfile(options) {
    let promise = new Promise((resolve, reject) => {
      this.storageLoad('ondetemTK')
      .then((token) => {
        let data = options.data;
        data['token'] = token;

        /*this.api.add({
          controller: options.controller,
          body: data,
        })
          .map((res: Response) => res.json())
          .subscribe(data => {
            if(data.status == 200) {
              resolve(data.data);
            }
            else
              reject(new Error(data.error));
          });*/
          reject(null);
      });
    });
    return promise;
  }

  getUser() {
    return new Promise(resolve => {
      this.storageLoad('user')
      .then((u: string) => {
        let usr = <IUser>JSON.parse(u);
        resolve(usr);
      }, (err) => {
        resolve(err);
      });
    });
  }

  setPreferredProfile(prefs) {
    return new Promise(resolve => {
      this.storageLoad('user')
      .then((u: string) => {
        let usr = <IUser>JSON.parse(u);
        usr.preferred = prefs;
        this.storageSave('user', JSON.stringify(usr));
        resolve(usr);
      }, (err) => {
        resolve(err);
        
      });
    });
    //this.storageSave('profile', JSON.stringify(prefs));
  }

  findAll(options: any) {
    let promise = new Promise((resolve, reject) => {
      if(!options) //throw new Error('invalid options');
        reject(new Error('invalid options'));

      if(this._cached$[options.controller] && this._cached$[options.controller] !== null && this._cached$[options.controller] !== []) {
        //this._subjects$[options.controller].next(this._cached$[options.controller]);
        resolve(this._cached$[options.controller]);
      }
      /*else {
        return this.api.findAll(options)
        .map((res: Response) => res.json())
        .toPromise()
        .then((data) => {
          console.log(data);
          if(data.status == 200) {
            //this._subjects$[options.controller].next(ret);
            if (data['randCat'] != null) {
              this._cached$['randomProduct'] = data['randCat'];
              console.log(data['randCat']);
            }

            if(_.contains(this._toStorage, options.controller))
              this._cached$[options.controller] = data.data;

            if(_.contains(this._subjects$, options.controller))
              this._subjects$[options.controller].next(data.data);
            
            resolve(data.data);
          }
          else {
            console.log(data);
            reject(data.error);
          }
        })
       .catch(error => { console.log(error) });
      }*/
      reject(null);
    });
    return promise;
  }

  getCategories(options: any) {
    //: Promise<ICategory[]> {
    let self = this;
    let uri = options.controller || 'categories';
    let url: string = self.helper.getAPI(uri);

    let promise = new Promise((resolve, reject) => {

      self.storageLoad('categories')
      .then((cats: Array<ICategory>) => {
        if (cats) {
          resolve(cats);
        } else {
          self.api.get(url, {
            query: options.query
          })
          .map((res: Response) => res.json())
          .toPromise()
          .then((response) => {
            let cats = response.data;
            self.storageSave('categories', cats);
            resolve(cats);
          })
        }
      })
      .catch((err) => {
        reject(err);
        //self.handleError(err);
      });
    });
    return promise;
  }

  getBalance(options: any) {
    let promise = new Promise((resolve, reject) => {
      /*this.api.findAll(options)
      .map((res: Response) => res.json())
      .subscribe((data) => {
        if(data.status == 200)
          resolve(data.data);
        else
          reject(data.error);
      });*/
      reject(null);
    });
    return promise;
  }

  getPretty(options: any) {
    let promise = new Promise((resolve, reject) => {
      if(!options) //throw new Error('invalid options');
        reject(new Error('invalid options'));
      
      /*this.api.getPretty(options)
        .map((res: Response) => res.json())
        .subscribe((data) => {
          if(data.status == 200) {
            resolve(data.data);
          }
          else {
            reject(data.error);
          }
        });*/
        reject(null);
    });
    return promise;
  }

  search(query) {
    //: Promise<ICategory[]> {
    let url: string = this.helper.getAPI('search');
    let self = this;

    let promise = new Promise((resolve, reject) => {
      self.api.get(url, query)
        .map((res: Response) => res.json())
        .toPromise()
        .then((response) => {
          if(response.status == 200) {
            resolve(response.data);
          }
          else {
            reject(response.error);
          }
        })
        .catch((err) => {
          reject(err);
          //self.handleError(err);
        });
    });
    return promise;
  }

  addSocialAction(options) {
    let promise = new Promise((resolve, reject) => {
      /*this.api.add({
        controller: options.controller,
        body: options.data,
        query: {}
      })
        .map((res: Response) => res.json())
        .subscribe((data) => {
          if(data.status == 200) {
            resolve(data.data);
          }
          else {
            reject(data.error);
          }
        });*/
        reject(null);
    });
    return promise;
  }

  addPreRegisterSeller(body) {
    let self = this;
    let promise = new Promise((resolve, reject) => {
      /*self.api.add({
        controller: 'auth/seller-register',
        body: body
      })
      .map((res: Response) => res.json())
      .subscribe((data) => {
        if(data.status == 200) {
          resolve(data.data);
        }
        else {
          reject(data.error);
        }
      });*/
      reject(null);
    });
    return promise;
  }

  /*return Observable.create(observer => {
    observer.next(CUSTOMERS);
    observer.complete();
  });*/

  storageLoad(name) {
    let promise = new Promise((resolve, reject) => {
      if (name == undefined || name == '')
        reject(null);

      this.storage.get(name)
        .then((data) => {
          resolve(JSON.parse(data));
        }, (err) => {
          console.log(err);
          // throw err
          reject(null);
        });
    });

    return promise;
  }

  storageSave(name, data) {
    let promise = new Promise((resolve, reject) => {
      if (name == undefined || name == '')
        reject(null);

      let info: string = JSON.stringify(data);
      this.storage.set(name, info)
        .then(() => {
          resolve(true);
        }, (err) => {
          console.log(err);
          reject(false);
        });
    });

    return promise;
  }

  storageClear() {
    return this.storage.clear()
      .then(() => {
        return true;
      }, (err) => {
        console.log(err);
        return false;
      });
  }

  storageRemove(item) {
    return this.storage.remove(item)
    .then(() => {
      return true;
    }, (err) => {
        console.log(err);
      return false
    });
  }

  /* temporary */
  lstorageLoad(name) {
    let promise = new Promise((resolve, reject) => {
      try {
        let value = window.localStorage.getItem(name);
        if(value)
          resolve(value);
        else
          throw new Error(name + ' não encontrado no db');
      }
      catch(e) {
        reject(e);
      }
    });
    return promise;
  }

  lstorageSave(name, data) {
    let promise = new Promise((resolve, reject) => {
      try {
        window.localStorage.setItem(name, data);
        resolve(true);
      }
      catch(e) {
        reject(e);
      }
    });
    return promise;
  }

  lstorageClear() {
    let promise = new Promise((resolve, reject) => {
      try {
        window.localStorage.removeItem('ondetemTK');
        window.localStorage.removeItem('user');
        resolve(true);
      }
      catch(e) {
        reject(e);
      }
    });
    return promise;
  }

  lstorageRemove(item) {
    let promise = new Promise((resolve, reject) => {
      try {
        window.localStorage.removeItem(item);
        resolve(true);
      }
      catch(e) {
        reject(e);
      }
    });
    return promise;
  }

  /*filterResults(list, query: any) {
    if(query == {} || query == null) {
      return list;
    }

    let res = _.filter(list, function(value) {
      for (var key in query) {
        if(query[key] === value[key] || (_.isObject(query[key]) && _.isEqual(query[key], value[key])))
          return true;
      }
      return false;
    });

    return (res.length) ? res : null;
  }*/
}