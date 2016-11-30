import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Subject } from 'rxjs/Rx';
import 'rxjs/Rx';

import { APIService } from '../api/api.service';

import _ from 'underscore';

//import { ICategory, IBuyer, ISeller, IOffer } from '../interfaces'; //, IReview, IReviewFact, IComment, ISocialFact, IUser, IRelationship, ITransaction, IAction, IDate

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

  get searchItems$() { return this._subjects$.searchitems.asObservable(); }
  get offers$() { return this._subjects$.offers.asObservable(); }
  get catalog$() { return this._subjects$.catalog.asObservable(); }
  get reviews$() { return this._subjects$.reviews.asObservable(); }
  get comments$() { return this._subjects$.comments.asObservable(); }
  get categories$() { return this._subjects$.categories.asObservable(); }
  get sellers$() { return this._subjects$.sellers.asObservable(); }
  get buyers$() { return this._subjects$.buyers.asObservable(); }
  get balance$() { return this._subjects$.loyalty.asObservable(); }
  get loggedUser$() { return this._subjects$.user.asObservable(); }

  constructor(public api: APIService) {
    this.api.Init("offers");

    this._subjects$ = {
      buyers: new Subject(),
      offers: new Subject(),
      catalog: new Subject(),
      reviews: new Subject(),
      comments: new Subject(),
      categories: new Subject(),
      sellers: new Subject(),
      searchitems: new Subject(),
      user: new Subject(),
      loyalty: new Subject(),
    };

    this._cached$ = {
      loggedUser: null,
      categories: null,
      visitingCompany: null
    };

    this.setVisitingCompany({
      id: 1,
      name: "Casa da Mãe Joana",
      description: "Artigos Genéricos",
      address: "Rua da casa da Joana",
      location: "",
      hours: "8h00 as 18h00",
      photoSrc: "assets/img/generic-company.png",
      thumbSrc: "assets/img/generic-company-logo.png"
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
    //USERS[0].coins.balance = USERS[0].coins.balance + coins;
    //this._subjects$["users"].next(USERS[0]);
  }

  setVisitingCompany(cp: any) {
    return this._cached$['visitingCompany'] = cp;
  }

  getVisitingCompany() {
    return this._cached$['visitingCompany'];
  }

  fetchUser(data) {
    if(this._cached$['loggedUser']) {
      this._subjects$['user'].next(this._cached$['loggedUser']);
    }
    else {
      if(data === {} || data === null)
        data = this._cached$['loggedUser'];

      this.api.findAll({
        controller: 'buyers',
        query: { 'userId': { test: "like binary", value: data.userId } }
      })
        .map((res: Response) => res.json())
        .subscribe(data => {
          this._cached$['loggedUser'] = data["data"][0];
          this._subjects$['user'].next(this._cached$['loggedUser']);
        }, 
        error => console.log('Something went wrong'),
        () => console.log('user retrieved'));
    }
  }

  findAll(options: any) {
    if(!options) throw new Error('invalid options');

      if(this._cached$[options.controller] && this._cached$[options.controller] !== null && this._cached$[options.controller] !== []) {
        this._subjects$[options.controller].next(this._cached$[options.controller]);
      }
      else {
        this.api.findAll(options)
        .map((res: Response) => res.json())
        .subscribe(data => {
          // check data["status"]...
          let ret = data["data"];
          if(_.contains(this._toStorage, options.controller))
            this._cached$[options.controller] = ret;
          this._subjects$[options.controller].next(ret);
        }, 
        error => console.log('Something went wrong'),
        () => console.log('findAll Completed for ' + options.controller));
      }
  }

  getPretty(options: any) {
    if(!options) throw new Error('invalid options');

    this.api.getPretty(options)
        .map((res: Response) => res.json())
        .subscribe(data => {
          // check data["status"]...
          let ret = data["data"];
          this._subjects$[options.controller].next(ret);
        }, 
        error => console.log('Something went wrong'),
        () => console.log('getPretty Completed for ' + options.controller));
  }

  search(options: any) {
    this.api.search(options)
      .map((res: Response) => res.json())
      .subscribe(data => {
        // check data["status"]...
        this._subjects$['searchitems'].next(data["data"]);
      }, 
      error => console.log('Something went wrong'),
      () => console.log('search Completed for ' + options.term));
  }

  addReview(review) {
    this.api.add({
      controller: 'review-facts',
      body: review,
      query: {}
    })
      .map((res: Response) => res.json())
      .subscribe(data => {
        // check data["status"]...
        //this._subjects$[options.controller].next(data["data"]);
        console.log(data);
      }, 
      error => console.log('Something went wrong'),
      () => console.log('findAll Completed for ' + 'review-facts'));
  }

  addComments(comment) {
    // COMMENTS.push(comment);
    // this.findAllComments({ query: {} });
  }

  addPreRegisterSeller() {
    return this.api.add({
      controller: 'auth/seller-register',
      body: { 
        salesman: this._cached$['loggedUser'].buyerId,
        company: this._cached$['visitingCompany']
      },
      query: {}
    })
    .map((res: Response) => res.json());
  }

  /*return Observable.create(observer => {
    observer.next(CUSTOMERS);
    observer.complete();
  });*/

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