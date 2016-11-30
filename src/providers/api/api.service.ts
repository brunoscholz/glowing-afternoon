//import { Storage, LocalStorage } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http'; //Response

import { Observable } from 'rxjs/Observable';
// import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map'; 
import 'rxjs/add/operator/catch'

import { APISettings } from './api-settings';

import _ from 'underscore';

@Injectable()
export class APIService {
  private config: any;
  
  constructor(private http: Http) {
    //this.http = http;
  }

  Init(controller: string) {
    //apiKey: MLabSettings.APIKEY,
    //includeKey: "?apiKey=" + MLabSettings.APIKEY

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
  findAll (options): Observable<any> {
    var database = options.controller || 'offers';
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

    return this.http.get(url, {
      search: params
    });
  }

  private post(url, body, options = <any>{}, headerType = 'application/x-www-form-urlencoded') {
    let headers = new Headers();
    headers.append('Content-Type', headerType);

    let params: URLSearchParams = new URLSearchParams();
    //params.set('apiKey', this.config.apiKey);
    _.each(options, function(value, key) {
      if(value) {
        params.set(key+'', (_.isObject(value) ? JSON.stringify(value) : value+''));
      }
    });

    let realBody = this.assembleBody(body).join('&');

    return this.http.post(url, realBody, {
      headers: headers
    });
  }

  private assembleBody(body) {
    //joana@casadamaejoana.com
    let p = [];
    let self = this;
    _.each(body, function(value, key) {
      if(_.isObject(value)) {
        let out = self.assembleBody(value);
        p = p.concat(out);
        /*_.each(value, function(v, k) {
          p.push(k + '=' + v);
        });*/
      }
      else
        p.push(key + '=' + value);
    });

    return p; //.join('&');
  }
}