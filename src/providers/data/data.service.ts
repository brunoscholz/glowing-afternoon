import { Injectable } from '@angular/core';
import { NativeStorage } from 'ionic-native';
import { Response } from '@angular/http';

import { Observable, Observer } from 'rxjs/Rx';
import 'rxjs/Rx';

import { IUser, ISeller } from './interfaces';
import { APIService } from '../api/api.service';
import { UtilProvider } from '../utils/util.provider';

import _ from 'underscore';


//let favorites = [];

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

  constructor(public api: APIService, public util: UtilProvider) {
    this.api.Init("offers");

    this._subjects$ = {};

    this.balance$ = Observable.create((observer:Observer<any>) => {
      this._subjects$['loyalty'] = observer;
    }).share();

    this._cached$ = {
      categories: null,
      visitingCompany: null
    };

    this.setVisitingCompany(<ISeller>{
      name: "",
      about: "",
      email: "",
      website: "",
      phone: "",
      cellphone: "",
      hours: "",
      status: "PAY",
      billingAddress: {
        address: "",
        city: "Curitiba",
        state: "PR",
        postCode: "",
        country: "Brasil (BRA)"
      },
      picture: {
        cover: "assets/img/generic-cover.jpg",
        thumbnail: "assets/img/generic-avatar.png"
      }
    });
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

  setVisitingCompany(cp: ISeller) {
    //this.storageSave('visitingCompany', JSON.stringify(cp));
    this.visitingCompany = cp;
  }

  getVisitingCompany() {
    return this.visitingCompany;
  }

  updateProfile(options) {
    let promise = new Promise((resolve, reject) => {
      this.storageLoad('ondetemTK')
      .then((token) => {
        let body = { token: token }
        if(options.pass)
          body['UserForm'] = options.pass;

        if(options.username)
          body['UserForm'] = options.username;

        if(options.picture) {
          body['Picture'] = options.pic;
          body['UserForm'] = options.form;
        }

        this.api.add({
          controller: 'auth/settings',
          body: body,
          query: {}
        })
          .map((res: Response) => res.json())
          .subscribe(data => {
            if(data.status == 200) {
              resolve(data.data);
            }
            else
              reject(data.error);
          });
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
        resolve(null);
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
        resolve(null);
        
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
      else {
        this.api.findAll(options)
        .map((res: Response) => res.json())
        .subscribe((data) => {
          if(data.status == 200) {
            //this._subjects$[options.controller].next(ret);
            if(_.contains(this._toStorage, options.controller))
              this._cached$[options.controller] = data.data;

            if(_.contains(this._subjects$, options.controller))
              this._subjects$[options.controller].next(data.data);
            
            resolve(data.data);
          }
          else {
            reject(data.error);
          }
        });
      }
    });
    return promise;
  }

  getBalance(options: any) {
    let promise = new Promise((resolve, reject) => {
      this.api.findAll(options)
      .map((res: Response) => res.json())
      .subscribe((data) => {
        if(data.status == 200)
          resolve(data.data);
        else
          reject(data.error);
      });
    });
    return promise;
  }

  getPretty(options: any) {
    let promise = new Promise((resolve, reject) => {
      if(!options) //throw new Error('invalid options');
        reject(new Error('invalid options'));
      
      this.api.getPretty(options)
        .map((res: Response) => res.json())
        .subscribe((data) => {
          if(data.status == 200) {
            resolve(data.data);
          }
          else {
            reject(data.error);
          }
        });
    });
    return promise;
  }

  search(options: any) {
    let promise = new Promise((resolve, reject) => {
      this.api.search(options)
        .map((res: Response) => res.json())
        .subscribe((data) => {
          if(data.status == 200) {
            resolve(data.data);
          }
          else {
            reject(data.error);
          }
        });
    });
    return promise;
  }

  addSocialAction(options) {
    let promise = new Promise((resolve, reject) => {
      this.api.add({
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
        });
    });
    return promise;
  }

  addPreRegisterSeller() {
    let self = this;
    let cp: ISeller;
    let promise = new Promise((resolve, reject) => {
      self.storageLoad('visitingCompany')
      .then((co: string) => {
        cp = <ISeller>JSON.parse(co);
        return self.getUser();
      })
      .then((usr: IUser) => {
        let seller = {
          Seller: cp,
          BillingAddress: cp.billingAddress,
          Picture: cp.picture,
          salesman: usr.userId
        }
        delete seller['Seller']['billingAddress'];
        delete seller['Seller']['picture'];
        self.api.add({
          controller: 'auth/seller-register',
          body: seller,
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
        });

      });
    });
    return promise;
  }

  /*return Observable.create(observer => {
    observer.next(CUSTOMERS);
    observer.complete();
  });*/

  nstorageLoad(name) {
    return NativeStorage.getItem(name)
      .then((data) => {
        return data;
      }, (err) => {
        console.log(err);
        return null;
      });
  }

  nstorageSave(name, data) {
    return NativeStorage.setItem(name, data)
      .then(() => {
        return true;
      }, (err) => {
        console.log(err);
        return false;
      })
  }

  nstorageClear() {
    return NativeStorage.clear()
      .then(() => {
        return true;
      }, (err) => {
        console.log(err);
        return false;
      });
  }

  nstorageRemove(item) {
    return NativeStorage.remove(item)
    .then(() => {
      return true;
    }, (err) => {
        console.log(err);
      return false
    });
  }

  /* temporary */
  storageLoad(name) {
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

  storageSave(name, data) {
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

  storageClear() {
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

  storageRemove(item) {
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