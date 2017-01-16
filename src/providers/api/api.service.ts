//import { Storage, LocalStorage } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { APISettings } from './api-settings';

import _ from 'underscore';

@Injectable()
export class APIService {
  private config: any;
  
  constructor(private http: Http) {
    //this.http = http;
  }

  Init(controller: string) {
    this.config = {
      baseUrl: APISettings.WEBURL + APISettings.APIVERSION + "/",
      controllerUrl: APISettings.WEBURL + APISettings.APIVERSION + "/" + controller,
    }
  }

  Change(controller: string) {
    this.config.controllerUrl = this.config.baseUrl + controller;
    //console.log(this.config.controllerUrl);
  }

  // get by query
  findAll (options: any): Observable<any> {
    var database = options.controller || 'offers';
    var OPTIONAL_PARAMS = <any> {
      q: options.query || null,
      f: options.setOfFields || null,
      fo: options.findOne || null,
      s: options.sortOrder || null,
      pg: options.page || null,
      l: options.limit || null,
      ft: options.fromto || null,
      asset: options.asset || null,
      token: options.auth || null
    };

    if (database === null) {
      throw new Error('invalid options');
    } else {
      this.Change(database);
      return this.get(this.config.controllerUrl, OPTIONAL_PARAMS);
    }
  }

  getPretty (options: any) : Observable<any> {
    var database = options.controller || 'offers';
    var url = options.url;
    var OPTIONAL_PARAMS = <any> {
      q: options.query || null,
      f: options.setOfFields || null,
      fo: options.findOne || null,
      s: options.sortOrder || null,
      pg: options.page || null,
      l: options.limit || null,
      ft: options.fromto || null
    };

    if (database === null) {
      throw new Error('invalid options');
    } else {
      return this.get(this.config.baseUrl + url, OPTIONAL_PARAMS);
    }
  }

  search(options): Observable<any> {
    // f: searchFor categories, users, companies and offers
    var OPTIONAL_PARAMS = <any> {
      q: options.term || null,
      f: options.searchFor || null,
      s: options.sortOrder || null,
      pg: options.page || null,
      l: options.limit || null,
    };

    if (options.term === null) {
      throw new Error('invalid options');
    } else {
      this.Change('search');
      return this.get(this.config.controllerUrl, OPTIONAL_PARAMS);
    }
  }

  add (options): Observable<any> {
    var database = options.controller || 'review-facts';
    var body = options.body || null;
    var OPTIONAL_PARAMS = <any> {
      q: options.query || null,
      f: options.setOfFields || null,
      fo: options.findOne || null,
      s: options.sortOrder || null,
      pg: options.page || null,
      l: options.limit || null,
      ft: options.fromto || null,
      v: APISettings.APPVERSION,
    };

    if (database === null || body === null) {
      throw new Error('invalid options');
    } else {
      this.Change(database);
      return this.post(this.config.controllerUrl, body, OPTIONAL_PARAMS);
    }
  }

  private get(url, options = <any>{}) {
    let params: URLSearchParams = new URLSearchParams();
    //params.set('apiKey', this.config.apiKey);
    _.each(options, function(value, key) {
      if(value) {
        params.set(key + '', (_.isObject(value) ? JSON.stringify(value) : value + ''));
      }
    });
    params.set('v', APISettings.APPVERSION);

    return this.http.get(url, {
      search: params
    })
    .timeout(30000, new Error('timeout exceeded'));
  }

  private post(url, body, options = <any>{}, headerType = 'application/x-www-form-urlencoded') {
    let headers = new Headers();
    headers.append('Content-Type', headerType);

    /*let params: URLSearchParams = new URLSearchParams();
    //params.set('apiKey', this.config.apiKey);
    _.each(body, function(value, key) {
      if(value) {
        params.set(key+'', (_.isObject(value) ? JSON.stringify(value) : value+''));
      }
    });
    params.set('v', APISettings.APPVERSION);*/

    // let realBody = encodeURIComponent(body);
    let params = this.assembleBody(body).join('&');
    params += '&v=' + APISettings.APPVERSION;

    return this.http.post(url, params, {
      headers: headers
    })
    .timeout(30000, new Error('timeout exceeded'));
  }

  /*private assembleBody(body, arrayName = '') {
    let p = [];
    let self = this;
    _.each(body, function(value, key) {
      if(_.isObject(value) || _.isArray(value)) {
        let out = self.assembleBody(value, key+'');
        p = p.concat(out);
        
      }
      else {
        let name = key;
        if(arrayName !== '')
          name = arrayName + '[' + key + ']';

        p.push(key + '=' + value);
      }
    });

    p.push('v=' + APISettings.APPVERSION);

    return p; //.join('&');
  }*/

  private assembleBody(obj) {
    var name, value, fullSubName, subName, subValue, innerObj, i;
    let self = this;
    let query = [];

    for(name in obj) {
      value = obj[name];
        
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          //query += self.assembleBody(innerObj) + '&';
          //query = query.concat(innerObj);
          query.push(self.assembleBody(innerObj));
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          //query += self.assembleBody(innerObj) + '&';
          //query = query.concat(innerObj);
          query.push(self.assembleBody(innerObj));
        }
      }
      else if(value !== undefined && value !== null)
        //query += encodeURIComponent(name) + '=' + value + '&';
        query.push(name + '=' + value);
    }

    return query;
  }
}
/*ReviewFact: [{
  action: 'addReview',
  offerId: this.product.offerId,
  buyerId: 'logged',
  sellerId: '',
  rating: rate
}],
Review: [{
  title: this.title,
  body: this.description
}]*/