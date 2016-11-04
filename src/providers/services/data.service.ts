import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Subject } from 'rxjs/Rx';
import 'rxjs/Rx';

import { APIService } from './api.service';

import _ from 'underscore';

import { IProduct, IProductFact, IUser } from '../interfaces'; //ICategory, IReview, IReviewFact, IComment, ISocialFact, IUser, IRelationship, ITransaction, IAction, IDate

//let favorites = [];

@Injectable()
export class DataService {

	private _subjects$: any;
	private visitingCompany: any = {};

	get items$() { return this._subjects$.items.asObservable(); }
	get offers$() { return this._subjects$.offers.asObservable(); }
	get reviews$() { return this._subjects$.reviews.asObservable(); }
	get comments$() { return this._subjects$.comments.asObservable(); }
	get categories$() { return this._subjects$.categories.asObservable(); }
	get companies$() { return this._subjects$.companies.asObservable(); }
	get users$() { return this._subjects$.users.asObservable(); }

	constructor(public api: APIService) {
    	this.api.Init("offers");

		this._subjects$ = {
			users: new Subject(),
			items: new Subject(),
			offers: new Subject(),
			reviews: new Subject(),
			comments: new Subject(),
			categories: new Subject(),
			companies: new Subject()
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

	getDemoUser() {
		//this._subjects$["users"].next(USERS[0]);
	}

	findAll(options: any) {
		if(!options) throw new Error('invalid options');

    	this.api.findAll(options)
			.map((res: Response) => res.json())
			.subscribe(data => {
				console.log(data);
				this._subjects$[options.controller].next(data["data"]);
			}, 
			error => console.log('something went wrong'),
			() => console.log('findAll Completed for ' + options.controller));
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