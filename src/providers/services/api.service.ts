//import { Storage, LocalStorage } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http'; //Response

// import { Observable } from 'rxjs/Observable';
// import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map'; 
import 'rxjs/add/operator/catch'

import { APISettings } from '../api-settings';

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
  }

  /*
   * ACTIONS
   *
   *
  */

  // get by query
  findAll (options) {
    var database = options.controller || 'offers';
    var OPTIONAL_PARAMS = <any> {
      q: options.query || null,
      c: options.resultCount || null,
      f: options.setOfFields || null,
      fo: options.findOne || null,
      s: options.sortOrder || null,
      sk: options.skipResults || null,
      l: options.limit || null
    };

    if (database === null) {
      throw new Error('invalid options');
    } else {
      this.Change(database);
      return this.get(this.config.controllerUrl, OPTIONAL_PARAMS);
    }
  }

  get(url, options = <any>{}) {
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

  post(url, body, options = <any>{}, headerType = 'application/json') {
    let headers = new Headers();
    headers.append('Content-Type', headerType);

    let params: URLSearchParams = new URLSearchParams();
    //params.set('apiKey', this.config.apiKey);
    _.each(options, function(value, key) {
      if(value) {
        params.set(key+'', (_.isObject(value) ? JSON.stringify(value) : value+''));
      }
    });

    return this.http.post(url, JSON.stringify( body ), {
      search: params,
      headers: headers
    });
  }

  put(url, body, options = <any>{}, headerType = 'application/json;charset=UTF-8') {
    let headers = new Headers();
    headers.append('Content-Type', headerType);

    let params: URLSearchParams = new URLSearchParams();
    //params.set('apiKey', this.config.apiKey);
    _.each(options, function(value, key) {
      if(value) {
        params.set(key+'', (_.isObject(value) ? JSON.stringify(value) : value+''));
      }
    });

    return this.http.put(url, JSON.stringify( body ), {
      search: params,
      headers: headers
    });
  }
}