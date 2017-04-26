import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import _ from 'underscore';

@Injectable()
export class ApiService {

  constructor(
    public http: Http
  ) {
  }

  treatOptions(options) {
    let OPTIONAL_PARAMS = <any> {
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
    //v: APISettings.APPVERSION,
    return OPTIONAL_PARAMS;
  }

  get(url, opt = <any>{}) {
    let params: URLSearchParams = new URLSearchParams();
    //params.set('apiKey', this.config.apiKey);
    let options = this.treatOptions(opt);
    _.each(options, function(value, key) {
      if(value) {
        params.set(key + '', (_.isObject(value) ? JSON.stringify(value) : value + ''));
      }
    });
    //params.set('v', APISettings.APPVERSION);

    return this.http.get(url, {
      search: params
    })
    .timeout(30000);
  }

  post(url, body, opt = <any>{}, headerType = 'application/x-www-form-urlencoded') {
    let headers = new Headers();
    headers.append('Content-Type', headerType);

    //let options = this.treatOptions(opt);
    let params = this.assembleBody(body).join('&');
    //params += '&v=' + APISettings.APPVERSION;

    return this.http.post(url, params, {
      headers: headers
    })
      .timeout(30000)
      .catch(this.onCatch)
      .do((res: Response) => {
          this.onSubscribeSuccess(res);
      }, (error: any) => {
          this.onSubscribeError(error);
      })
      .finally(() => {
          this.onFinally();
      });
  }

  /**
   * Error handler.
   * @param error
   * @param caught
   * @returns {ErrorObservable}
   */
  private onCatch(error: any, caught: Observable<any>): Observable<any> {
      return Observable.throw(error);
  }

  /**
   * onSubscribeSuccess
   * @param res
   */
  private onSubscribeSuccess(res: Response): void {
  }

  /**
   * onSubscribeError
   * @param error
   */
  private onSubscribeError(error: any): void {
    //this.util.notifyError(error);
  }

  /**
   * onFinally
   */
  private onFinally(): void {
  }

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
