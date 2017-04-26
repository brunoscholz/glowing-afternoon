import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';

import { IUser, IBuyer, ISeller } from '../../common/models/interfaces';
import { Helper } from '../../common/services/helper.service';
import { ApiService } from '../../common/services/api.service';

//import { TranslateService } from 'ng2-translate';


@Injectable()
export class UserService {
  user: IUser;
  buyer: IBuyer;
  sellers: ISeller[];
  userUpdateAvatarAPI: string = this.helper.getAPI('user/update-avatar');

  constructor(
    public events: Events,
    private helper: Helper,
    public api: ApiService
  ) {
    
  }

  // get user
  getUser(): Promise<IUser> {
    let url: string = this.helper.getAPI('user/my-info');

    return this.api.get(url, {})
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
  }

  // update
  update(params): Promise<IUser> {
    let url: string = this.helper.getAPI('user/update');

    return this.api.post(url, params)
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
  }

  // sign up
  signUp(params): Promise<IUser> {
    let url: string = this.helper.getAPI('auth/sign-up');
    let data: Object = params;

    return this.api.post(url, data)
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
  }

  // get verification code
  getVerificationCode(params) {
    let url: string = this.helper.getAPI('auth/get-verification-code');
    let data: Object = params;

    return this.api.post(url, data)
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
  }

  // log in
  logIn(params): Promise<IUser> {
    let url: string = this.helper.getAPI('auth/sign-in');
    let data: Object = params;

    console.log(url, data);

    return this.api.post(url, data)
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
  }

  logInWithFacebook(params): Promise<IUser> {
    let url: string = this.helper.getAPI('auth/log-in-with-facebook');
    let data: Object = params;

    return this.api.post(url, data)
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
  }

  // log in with wechat
  logInWithWechat(params): Promise<IUser> {
    let url: string = this.helper.getAPI('auth/log-in-with-wechat');
    let data: Object = params;

    console.log(url, data);

    return this.api.post(url, data)
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
  }

  // log out
  logOut(): Promise<IUser> {
    let url: string = this.helper.getAPI('auth/log-out');

    return this.api.post(url, {})
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
  }

  // handle error
  private handleError(error: any) {
    return Promise.reject(error.message || error);
  }
}
