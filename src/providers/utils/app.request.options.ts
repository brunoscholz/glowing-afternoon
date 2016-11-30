import { Inject } from '@angular/core'; //, Injectable, OpaqueToken
import { BaseRequestOptions, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { MLabSettings } from '../mlab-settings';

export const WEBAPI_URL_TOKEN = MLabSettings.WEBURL;

export class AppRequestOptions extends BaseRequestOptions {
  constructor(@Inject(WEBAPI_URL_TOKEN) private webApiBaseUrl:string) {
  	super();
  	console.log('webApiBaseUrl = '+webApiBaseUrl);
  }

  merge(options?:RequestOptionsArgs):RequestOptions {
    options.url = (this.webApiBaseUrl ? this.webApiBaseUrl :
    				'https://api.mlab.com/api/1/') + options.url;
    return super.merge(options);
  }
}