import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Subject } from 'rxjs/Rx';
import 'rxjs/Rx';

import { APIService } from './api.service';

import _ from 'underscore';

import { IBuyer, ISeller, IUser, IOffer } from '../interfaces'; //ICategory, IReview, IReviewFact, IComment, ISocialFact, IUser, IRelationship, ITransaction, IAction, IDate

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
	private visitingCompany: any = {};

	get searchItems$() { return this._subjects$.searchitems.asObservable(); }
	get offers$() { return this._subjects$.offers.asObservable(); }
	get reviews$() { return this._subjects$.reviews.asObservable(); }
	get comments$() { return this._subjects$.comments.asObservable(); }
	get categories$() { return this._subjects$.categories.asObservable(); }
	get companies$() { return this._subjects$.companies.asObservable(); }
	get buyers$() { return this._subjects$.buyers.asObservable(); }

	constructor(public api: APIService) {
    	this.api.Init("offers");

		this._subjects$ = {
			buyers: <Subject<IBuyer[]>>new Subject(),
			offers: <Subject<IOffer[]>>new Subject(),
			reviews: new Subject(),
			comments: new Subject(),
			categories: new Subject(),
			companies: <Subject<ISeller[]>>new Subject(),
			searchitems: new Subject()
		};

		this.visitingCompany = {
			id: 1,
		    name: "Casa da Mãe Joana",
		    description: "Artigos Genéricos",
		    address: "Rua da casa da Joana",
		    location: "",
		    hours: "8h00 as 18h00",
		    photoSrc: "assets/img/generic-company.png",
		    thumbSrc: "assets/img/generic-company-logo.png"
		};
	}

	creditUser(coins) {
		console.log(coins);
		//USERS[0].coins.balance = USERS[0].coins.balance + coins;
		//this._subjects$["users"].next(USERS[0]);
	}

	setVisitingCompany(cp: any) {
		return this.visitingCompany = cp;
	}

	getVisitingCompany() {
		return this.visitingCompany;
	}

	getLoggedUser() {
		let user = {
			userId: "zZN6prD6rzxEhg8sDQz1j",
			username: "admin",
			email: "admin@example.com",
			picture: { cover: "assets/img/card-saopaolo.png", large:"https://randomuser.me/api/portraits/men/3.jpg", medium:"https://randomuser.me/api/portraits/med/men/3.jpg", thumbnail:"https://randomuser.me/api/portraits/thumb/men/3.jpg" },
		    coins: { balance: 45 }
		}
		// this._subjects$["users"].next(user);
		return user;
	}

	findAll(options: any) {
		if(!options) throw new Error('invalid options');

    	this.api.findAll(options)
			.map((res: Response) => res.json())
			.subscribe(data => {
				// check data["status"]...
				this._subjects$[options.controller].next(data["data"]);
			}, 
			error => console.log('Something went wrong'),
			() => console.log('findAll Completed for ' + options.controller));
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

	findItems(options: any) {
		//this._subjects$["items"].next(this.filterResults(ITEMS, options.query));
	}

	findAllItems() {
		//this._subjects$["items"].next(ITEMS);
	}

	findAllReviews(options: any) {
		//this._subjects$["reviews"].next(this.filterResults(REVIEWS, options.query));
	}

	findAllComments(options: any) {
		//this._subjects$["comments"].next(this.filterResults(COMMENTS, options.query));
	}

	findAllCategories(options: any) {
		//this._subjects$["categories"].next(this.filterResults(CATEGORIES, options.query));
	}

	getCategory(query) {
		//return this.filterResults(CATEGORIES, query)[0];
	}

	findAllCompanies(options: any) {
		//this._subjects$["companies"].next(this.filterResults(CUSTOMERS, options.query));
	}

	addReview(review) {
		// let newId = _.max(REVIEWS, function(rev){ return rev.id; });
		// review.id = Number(newId) + 1;
		// REVIEWS.push(review);
		// this.findAllReviews({ query: { item: review.item } });
	}

	addComments(comment) {
		// COMMENTS.push(comment);
		// this.findAllComments({ query: {} });
	}

	/*return Observable.create(observer => {
		observer.next(CUSTOMERS);
		observer.complete();
	});*/
	findAllCustomers() {
		//this._subjects$["customers"].next(CUSTOMERS);
	}

	findAllUsers() {
		//this._subjects$["users"].next(USERS);
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