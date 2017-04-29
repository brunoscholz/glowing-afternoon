import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';

import { IUser, IBuyer, ISeller } from '../../common/models/interfaces';
import { Helper } from '../../common/services/helper.service';
import { ApiService } from '../../common/services/api.service';
import { AppService } from '../../common/services/app.service';

//import { TranslateService } from 'ng2-translate';


@Injectable()
export class UserService {
  user: IUser;
  buyer: IBuyer;
  sellers: ISeller[];
  userUpdateAvatarAPI: string = this.helper.getAPI('user/updateAvatar');

  constructor(
    public events: Events,
    private helper: Helper,
    public theApp: AppService,
    public api: ApiService
  ) {
    
  }

  // get user
  getUser(): Promise<IUser> {
    let url: string = this.helper.getAPI('auth/signin');

    let tk = this.theApp.authService.AuthToken;
    let body = { 'AuthModel[token]': encodeURIComponent(tk) };

    return this.api.post(url, body)
    .catch(this.handleError);
  }

  creditUser(coins) {
    console.log(coins);
  }

  updateProfile(options) {
    let url: string = this.helper.getAPI('auth/settings');

    let tk = this.theApp.authService.AuthToken;
    let data = options.data;
    data['token'] = encodeURIComponent(tk);

    return this.api.post(url, data)
    .catch(this.handleError);
  }

  getBalance(options: any) {
    let uri = options.controller || 'transaction';
    let url: string = this.helper.getAPI(uri);

    return this.api.get(url, options)
    .catch(this.handleError);
  }

  // update
  // settings
  update(params): Promise<IUser> {
    let url: string = this.helper.getAPI('user/update');

    return this.api.post(url, params)
    .catch(this.handleError);
  }


  // sign up
  signUp(params): Promise<IUser> {
    let url: string = this.helper.getAPI('auth/signup');
    let data: Object = params;

    return this.api.post(url, data)
    .catch(this.handleError);
  }

  // get verification code
  getVerificationCode(params) {
    let url: string = this.helper.getAPI('auth/get-verification-code');
    let data: Object = params;

    return this.api.post(url, data)
    .catch(this.handleError);
  }

  // log in
  logIn(params): Promise<IUser> {
    let url: string = this.helper.getAPI('auth/signin');

    return this.api.post(url, params)
    .catch(this.handleError);
  }

  logInWithFacebook(params): Promise<IUser> {
    let url: string = this.helper.getAPI('auth/log-in-with-facebook');
    let data: Object = params;

    return this.api.post(url, data)
    .catch(this.handleError);
  }

  forgotPassword(params) {
    let url: string = this.helper.getAPI('auth/forgot-password');
    let data: Object = params;

    return this.api.post(url, data)
    .catch(this.handleError);
  }

  // log in with wechat
  logInWithWechat(params): Promise<IUser> {
    let url: string = this.helper.getAPI('auth/log-in-with-wechat');
    let data: Object = params;

    return this.api.post(url, data)
    .catch(this.handleError);
  }

  // log out
  logOut(): Promise<IUser> {
    let url: string = this.helper.getAPI('auth/logout');

    return this.api.post(url, {})
    .catch(this.handleError);
  }

  // handle error
  private handleError(error: any) {
    return Promise.reject(error.message || error);
  }
}
