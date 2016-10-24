//import { Storage, LocalStorage } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http'; //Response

// import { Observable } from 'rxjs/Observable';
// import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map'; 
import 'rxjs/add/operator/catch'

import { MLabSettings } from '../mlab-settings';

import _ from 'underscore';

@Injectable()
export class MLabService {
  private config: any;
  
  constructor(private http: Http) {
    //this.http = http;
  }

  Init(collection: string) {
    this.config = {
      dbName: MLabSettings.DBNAME,
      apiKey: MLabSettings.APIKEY,
      baseUrl: "databases/",
      dbUrl: "databases/" + MLabSettings.DBNAME,
      collectionUrl: "databases/" + MLabSettings.DBNAME + '/collections/' + collection,
      includeKey: "?apiKey=" + MLabSettings.APIKEY
    }
  }

  Change(collection: string) {
    this.config.collectionUrl = "databases/" + this.config.dbName + '/collections/' + collection;
  }

  /*private preparyQueryParam (queryJson) {
    return _.isObject(queryJson) && Object.keys(queryJson).length ? JSON.stringify(queryJson) : "";
  }*/

  listDatabases () {
    return this.get(this.config.baseUrl);
  }

  listCollections (database: string) {
    if ((database === undefined)) {
      throw new Error('database name is required');
    }

    return this.get(this.config.baseUrl + database + '/collections');
  }

  listDocuments (options) {
    var database = options.database || this.config.dbName;
    var collectionName = options.collectionName || null;
    var OPTIONAL_PARAMS = <any>{
      q: options.query || null,
      c: options.resultCount || null,
      f: options.setOfFields || null,
      fo: options.findOne || null,
      s: options.sortOrder || null,
      sk: options.skipResults || null,
      l: options.limit || null
    };

    if (database === null || collectionName === null) {
      throw new Error('invalid options');
    } else {
      this.Change(collectionName);
      return this.get(this.config.collectionUrl, OPTIONAL_PARAMS);
    }
  }

  insertDocuments (options) {
    var database = options.database || this.config.dbName;
    var collectionName = options.collectionName || null;
    var documents = options.documents || null;

    if (database === null || collectionName === null || documents === null) {
      throw new Error('invalid options');
    } else {
      this.Change(collectionName);
      return this.post(this.config.collectionUrl, documents);
    }
  }

  updateDocuments (options) {
    var database = options.database || this.config.dbName;
    var collectionName = options.collectionName || null;
    var data = { "$set" : options.data } || null;
    var OPTIONAL_PARAMS = <any>{
      q: options.query || null,
      m: options.allDocuments || null,
      u: options.upsert || null
    };

    if (database === null || collectionName === null || data === null) {
      throw new Error('invalid options');
    } else {
      this.Change(collectionName);
      return this.put(this.config.collectionUrl, data, OPTIONAL_PARAMS);
    }
  }

  updateFields (options) {
    var database = options.database || this.config.dbName;
    var collectionName = options.collectionName || null;
    var data = options.data || null;
    var OPTIONAL_PARAMS = <any>{
      q: options.query || null,
      m: options.allDocuments || null,
      u: options.upsert || null
    };

    if (database === null || collectionName === null || data === null) {
      throw new Error('invalid options');
    } else {
      this.Change(collectionName);
      return this.put(this.config.collectionUrl, data, OPTIONAL_PARAMS);
    }
  }

  deleteDocuments (options) {
    var database = options.database || this.config.dbName;
    var collectionName = options.collectionName || null;
    var documents = options.documents || [];
    var OPTIONAL_PARAMS = <any>{
      q: options.query || null
    };

    if (database === null || collectionName === null) {
      throw new Error('invalid options');
    } else {
      this.Change(collectionName);
      return this.put(this.config.collectionUrl, documents, OPTIONAL_PARAMS);
    }
  }

  viewDocument (options) {
    var database = options.database || this.config.dbName;
    var collectionName = options.collectionName || null;
    var id = options.id || null;

    if (database === null || typeof id !== 'string' || id === null) {
      throw new Error('document id is required');
    } else {
      this.Change(collectionName);
      return this.get(this.config.collectionUrl + '/' + id);
    }
  }

  updateDocument (options) {
    var database = options.database || this.config.dbName;
    var collectionName = options.collectionName || null;
    var id = options.id || null;
    var updateObject = options.updateObject || null;

    if (database === null || typeof id !== 'string' || id === null || updateObject === null) {
      throw new Error('document id is required');
    } else {
      this.Change(collectionName);
      return this.post(this.config.collectionUrl + '/' + id, updateObject);
    }
  }

  deleteDocument = function (options) {
    var database = options.database || this.config.dbName;
    var collectionName = options.collectionName || null;
    var id = options.id || null;

    if (database === null || typeof id !== 'string' || id === null) {
      throw new Error('document id is required');
    } else {
      this.Change(collectionName);

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      var params: URLSearchParams = new URLSearchParams();
      params.set('apiKey', this.config.apiKey);

      return this.http.delete(this.config.collectionUrl + '/' + id, {}, {
        search: params,
        headers: headers
      });
    }
  }

  runCommand = function (options) {
    var database = options.database || this.config.dbName;
    var commands = options.commands || null;

    if (database === null || commands === null) {
      throw new Error('invalid options');
    } else {
      return this.post(this.config.baseUrl + database + '/runCommand', commands);
    }
  }

  get(url, options = <any>{}) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('apiKey', this.config.apiKey);

    _.each(options, function(value, key) {
      if(value) {
        params.set(key+'', (_.isObject(value) ? JSON.stringify(value) : value+''));
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
    params.set('apiKey', this.config.apiKey);

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
    params.set('apiKey', this.config.apiKey);

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