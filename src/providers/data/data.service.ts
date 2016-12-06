import { Injectable } from '@angular/core';
import { NativeStorage } from 'ionic-native';
import { Response } from '@angular/http';

import { Subject } from 'rxjs/Rx';
import 'rxjs/Rx';

import { IUser } from './interfaces';
import { APIService } from '../api/api.service';

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

  /*get searchItems$() { return this._subjects$.searchitems.asObservable(); }
  get offers$() { return this._subjects$.offers.asObservable(); }
  get catalog$() { return this._subjects$.catalog.asObservable(); }
  get reviews$() { return this._subjects$['review-facts'].asObservable(); }
  get comments$() { return this._subjects$['comment-facts'].asObservable(); }
  get follows$() { return this._subjects$['follow-facts'].asObservable(); }
  get favorites$() { return this._subjects$['favorite-facts'].asObservable(); }
  get categories$() { return this._subjects$.categories.asObservable(); }
  get sellers$() { return this._subjects$.sellers.asObservable(); }
  get buyers$() { return this._subjects$.buyers.asObservable(); }
  get loggedUser$() { return this._subjects$.user.asObservable(); }*/
  get balance$() { return this._subjects$.loyalty.asObservable(); }

  constructor(public api: APIService) {
    this.api.Init("offers");

    /*
      buyers: new Subject(),
      offers: new Subject(),
      catalog: new Subject(),
      'review-facts': new Subject(),
      'comment-facts': new Subject(),
      'follow-facts': new Subject(),
      'favorite-facts': new Subject(),
      categories: new Subject(),
      sellers: new Subject(),
      searchitems: new Subject(),
      user: new Subject(),
    */
    this._subjects$ = {
      loyalty: new Subject(),
    };

    this._cached$ = {
      categories: null,
      visitingCompany: null
    };

    this.setVisitingCompany({
      name: "",
      about: "",
      address: "",
      location: "",
      hours: "",
      phone: "",
      cellphone: "",
      website: "",
      email: "",
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

  setVisitingCompany(cp: any) {
    this.lstorageSave('visitingCompany', JSON.stringify(cp));
  }

  getVisitingCompany() {
    return JSON.parse(this.lstorageLoad('visitingCompany'));
  }

  updateProfile(options) {
    return new Promise(resolve => {
      let token = this.lstorageLoad('ondetemTK')
      //.then((token) => {
        let body = { token: token }
        if(options.pass)
          body['pass'] = options.pass;

        if(options.username)
          body['username'] = options.username;

        this.api.add({
          controller: 'auth/settings',
          body: body,
          query: {}
        })
          .map((res: Response) => res.json())
          .subscribe(data => {
            if(data.status == 200) {
              // this.storeUserCredentials(token);
              // this.storeUser(data.data[0]);
              //resolve(data.data[0]);
              resolve({error: 'not functioning'});
            }
            else
              resolve(null);
          });
      /*},
      (err) => {
        resolve(err);
      });*/
    });
  }

  getUser() {
    return new Promise(resolve => {
      let usr = JSON.parse(this.lstorageLoad('user'));
      if(usr)
        resolve(usr);
      else
        resolve(null);
    });
  }

  setPreferredProfile(prefs) {
    return new Promise(resolve => {
      let usr = JSON.parse(this.lstorageLoad('user'));
      if(usr) {
        usr.preferred = prefs;
        this.lstorageSave('user', JSON.stringify(usr));
        resolve(usr);
      }
      else
        resolve(null);
    });
    //this.lstorageSave('profile', JSON.stringify(prefs));
  }

  fetchUser(usr) {
    if(usr == {} || usr == null)
      usr = JSON.parse(this.lstorageLoad('user'));

    this.api.findAll({
      controller: 'buyers',
      query: { 'userId': { test: "like binary", value: usr.userId } }
    })
      .map((res: Response) => res.json())
      .subscribe(data => {
        let u = data['data'][0];
        this.lstorageSave('user', JSON.stringify(u));
        this._subjects$['user'].next(u);
      }, 
      error => console.log('Something went wrong'),
      () => console.log('user retrieved'));
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
          else
          {
            reject(data.error);
          }
        }, 
        error => console.log('Something went wrong'),
        () => console.log('findAll Completed for ' + options.controller));
      }
    });
    return promise;
  }

  getBalance(options: any) {
    this.api.findAll(options)
      .map((res: Response) => res.json())
      .subscribe((data) => {
        if(data.status == 200) {
          this._subjects$['loyalty'].next(data.data);
        }
      },
      error => console.log('Something went wrong'),
      () => console.log('findAll Completed for balance'));
  }

  getPretty(options: any) {
    let promise = new Promise((resolve, reject) => {
      if(!options) //throw new Error('invalid options');
        reject(new Error('invalid options'));
      
      this.api.getPretty(options)
        .map((res: Response) => res.json())
        .subscribe((data) => {
          if(data.status == 200) {
            // let ret = data["data"];
            // this._subjects$[options.controller].next(ret);
            resolve(data.data);
          }
          else
          {
            reject(data.error);
          }
        }, 
        error => console.log('Something went wrong'),
        () => console.log('getPretty Completed for ' + options.controller));
    });
    return promise;
  }

  search(options: any) {
    let promise = new Promise((resolve, reject) => {
      this.api.search(options)
        .map((res: Response) => res.json())
        .subscribe((data) => {
          if(data.status == 200) {
            //this._subjects$['searchitems'].next(data["data"]);
            resolve(data.data);
          }
          else
          {
            reject(data.error);
          }
        }, 
        error => console.log('Something went wrong'),
        () => console.log('search Completed for ' + options.term));
    });
    return promise;
  }

  addReview(review) {
    let promise = new Promise((resolve, reject) => {
      this.api.add({
        controller: 'review-facts',
        body: review,
        query: {}
      })
        .map((res: Response) => res.json())
        .subscribe((data) => {
          if(data.status == 200) {
            resolve(data.data);
          }
          else
          {
            reject(data.error);
          }
        }, 
        error => console.log('Something went wrong'),
        () => console.log('findAll Completed for ' + 'review-facts'));
    });
    return promise;
  }

  addComments(comment) {
    // COMMENTS.push(comment);
    // this.findAllComments({ query: {} });
  }

  addPreRegisterSeller() {
    let self = this;
    let promise = new Promise((resolve, reject) => {
      let cp = self.getVisitingCompany();
      console.log(cp);
      self.getUser()
      .then((usr: IUser) => {
        self.api.add({
          controller: 'auth/seller-register',
          body: { 
            salesman: usr.userId,
            company: self.getVisitingCompany()
          },
          query: {}
        })
        .map((res: Response) => res.json())
        .subscribe((data) => {
          if(data.status == 200) {
            resolve(data.data);
          }
          else
          {
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

  storageLoad(name) {
    return NativeStorage.getItem(name)
      .then((data) => {
        return data;
      }, (err) => {
        console.log(err);
        return null;
      });
  }

  storageSave(name, data) {
    return NativeStorage.setItem(name, data)
      .then(() => {
        return true;
      }, (err) => {
        console.log(err);
        return false;
      })
  }

  storageClear() {
    return NativeStorage.clear()
      .then(() => {
        return true;
      }, (err) => {
        console.log(err);
        return false;
      });
  }

  storageRemove(item) {
    return NativeStorage.remove(item)
    .then(() => {
      return true;
    }, (err) => {
        console.log(err);
      return false
    });
  }

  /* temporary */
  lstorageLoad(name) {
    let value = window.localStorage.getItem(name);
    if(value)
      return value;

    return null;
  }

  lstorageSave(name, data) {
    window.localStorage.setItem(name, data);
    return true;
  }

  lstorageClear() {
    window.localStorage.clear();
    return true;
  }

  lstorageRemove(item) {
    window.localStorage.removeItem(item);
    return true;
  }

  filterResults(list, query: any) {
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
  }
}