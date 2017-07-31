import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//import { Response } from '@angular/http';
//import { Subject } from 'rxjs/Rx';
//import { AppService } from '../services/app.service';
import { Facebook } from 'ionic-native';

import { IUser } from '../models/interfaces';

@Injectable()
export class AuthService {
  IS_AUTH: string = 'is_auth';
  USER_INFO: string = 'user_info';
  AUTH_TOKEN: string = 'ondetemTK';

  isAuth: boolean = false;
  userInfo: IUser;
  AuthToken: string = '';

  FB_APP_ID: number = 806581699497571;

  // constructor
  constructor(
    public http: Http,
    public events: Events,
    public storage: Storage
  ) {
  }

  // auth or login
  authOrLogin() {
    if (this.isAuth) {
      return true;
    } else {
      console.log('publish event app:gotoLogin');
      this.events.publish('app:gotoLogin');
    }
  }

  // get is auth
  getIsAuth() {
    let self = this;
    let promise = new Promise((resolve, reject) => {
      self.storage.get(self.AUTH_TOKEN)
      .then((value: string) => {
        let tk = JSON.parse(value);
        console.log(tk);
        if(tk['token'] != null && tk['token'] != undefined && tk['token'] != "") {
          self.AuthToken = tk['token'];
          //this.useCredentials(token);
          return self.getStorageAuth();
        } else {
          console.log("token not found");
          resolve(false);
        }
      })
      .then((isauth) => {
        self.isAuth = isauth ? true : false;
        return self.getUser();
      })
      .then((usr: IUser) => {
        self.userInfo = usr;
        resolve(self.isAuth);
      })
      .catch(this.handleError);
    });
    return promise;
  }

  getStorageAuth() {
    let self = this;
    let promise = new Promise((resolve, reject) => {
      self.storage.get(self.IS_AUTH)
      .then((value) => {
        resolve(value);
      }, (error) => {
        if(error.errorMessage)
          reject(new Error(error.errorMessage));
        else
          reject(error);
      });
    });
    return promise;
  }

  // get user
  getUser() {
    let self = this;
    let promise = new Promise((resolve, reject) => {
      self.storage.get(self.USER_INFO)
      .then((value: string) => {
        let usr = <IUser>JSON.parse(value);
        resolve(usr);
      }, (error) => {
        //return self.checkAuthentication();
        if(error.errorMessage)
          reject(new Error(error.errorMessage));
        else
          reject(error);
      });
    });
    return promise;
  }

  setPreferredProfile(prefs) {
    let self = this;
    let promise = new Promise((resolve, reject) => {
      self.storage.get(self.USER_INFO)
      .then((u: string) => {
        let usr = <IUser>JSON.parse(u);
        usr.preferred = prefs;
        self.storage.set(self.USER_INFO, JSON.stringify(usr));
        resolve(usr);
      }, (err) => {
        reject(err);
      });
    });
    return promise;
  }

  // log in
  logIn(params) {
    let userInfo: string = JSON.stringify(params[0]);
    this.isAuth = true;
    this.userInfo = <IUser>JSON.parse(userInfo);
    this.AuthToken = params['token'];

    this.storage.set(this.IS_AUTH, true);
    this.storage.set(this.USER_INFO, userInfo);
    this.StoreAuthToken(this.AuthToken);

    this.events.publish('auth:loggedIn');
  }

  StoreAuthToken(token) {
    this.isAuth = true;
    let model = {
      token: token,
      date: Date.now()
    }

    let tk: string = JSON.stringify(model);
    this.storage.set(this.AUTH_TOKEN, tk);
  }

  // reset
  reset(params) {
    this.logIn(params);
  }

  //
  // log out
  logOut() {
    this.isAuth = false;
    this.userInfo = null;

    this.storage.remove(this.IS_AUTH);
    this.storage.remove(this.USER_INFO);

    this.events.publish('auth:loggedOut');
  }

  //
  // wechat login
  wechatLogin() {
    this.getIsAuth().then(() => {
      if (!this.isAuth && this.isWeChatBrowser() && this.getParameterByName('noWeChatOAuth') != 'true') {
        window.location.assign('/api/wechat/o-auth');
      }
    });
  }

  //
  // is wechat browser
  isWeChatBrowser() {
    var ua = navigator.userAgent.toLowerCase();
    return (/micromessenger/.test(ua)) ? true : false ;
  }

  //
  // get Parameter By Name
  getParameterByName(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
  }

  /* FACEBOOK STUFF */
  connectWithFacebook() {
    return this.chainConnect();
  }

  chainConnect() {
    let self = this;
    let promise = new Promise((resolve, reject) => {
      Facebook.getLoginStatus()
      .then((response) => {
        return self.chainFbAuthenticate(response);
      })
      .then((response) => {
        return self.chainFbGetInfo(response);
      })
      .then((usr) => {
        return self.register(usr);
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
    });
    return promise;
  }

  chainFbAuthenticate(response) {
    //console.log('chainFbAuthenticate');
    let self = this;
    let promise = new Promise((resolve, reject) => {
      if (response.status === 'connected') {
        resolve(response.authResponse);
      } else {
        self.chainFbLogin()
        .then((response) => {
          resolve(response);
        }, (error) => {
          if(error.errorMessage)
            reject(new Error(error.errorMessage));
          else
            reject(error);
        });
      }
    });
    return promise;
  }

  chainFbGetInfo(response) {
    //console.log('chainFbGetInfo');
    let self = this;
    let params = ['email'];
    let userId = response.userID;
    let promise = new Promise((resolve, reject) => {
    
      Facebook.api("/me?fields=id,name,email", params)
      .then((user) => {
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        /*let usr = {
          name: user.name,
          email: user.email,
          gender: user.gender,
          picture: user.picture,
          socialId: userId,
          socialName: 'facebook'
        };*/
        let usr = {
          'AuthModel[socialId]': userId,
          'AuthModel[socialName]': 'facebook',
          'AuthModel[email]': user.email,
          'AuthModel[name]': user.name,
          'AuthModel[picture]': user.picture,
          'AuthModel[gender]': user.gender
        }
        //self.storeUser(usr, 'userFB');
        self.logIn(usr);
        resolve(usr);
      }, (error) => {
        if(error.errorMessage)
          reject(new Error(error.errorMessage));
        else
          reject(error);
      });

    });
    return promise;
  }

  chainFbLogin() {
    //console.log('chainFbLogin');
    let promise = new Promise((resolve, reject) => {
      let permissions = ["public_profile", "email", "user_friends"];

      Facebook.login(permissions)
      .then((response) => {
        if (response.status === 'connected') {
          resolve(response.authResponse);
        } else {
          reject(new Error('Não foi possível fazer o login.'));
        }
      }, (error) => {
        if(error.errorMessage)
          reject(new Error(error.errorMessage));
        else
          reject(error);
      });
    });
    return promise;
  }

  chainAuthenticate(usr) {
    //console.log('chainAuthenticate');
    let promise = new Promise((resolve, reject) => {
      if(usr)
        resolve(true);
      else
        reject(new Error('dont know what happened!'));
    });
    return promise;
  }

  doFbLogout() {
    Facebook.logout()
    .then(function(response) {
      //user logged out so we will remove him from the NativeStorage
      this.logout();
      this._logged.next(false);
    });
  }

  forgotPassword(user) {
    let promise = new Promise((resolve, reject) => {
      /*this.api.add({
        controller: 'auth/forgot-password',
        body: user,
      })
        .map((res: Response) => res.json())
        .subscribe(data => {
          if(data.status == 200) {
            resolve(true);
          }
          else
            reject(new Error(data.error));
        });*/
    });
    return promise;
  }

  /* NORMAL STUFF */

  authenticate(user) {
    let promise = new Promise((resolve, reject) => {
    });
    return promise;
  }

  register(user) {
    let promise = new Promise((resolve, reject) => {
      /*this.api.add({
        controller: 'auth/signup',
        body: user
      })
        .map((res: Response) => res.json())
        .subscribe(data => {
          if(data.status == 200) {
            //this.storeUserCredentials(data.token);
            this.logIn(data.data[0]);
            //this._logged.next(data.data[0]);
            resolve(true);
          }
          else {
            //this._logged.next(null);
            reject(new Error(data.error));
          }
        }, (err) => {
          reject(err);
        });*/
    });
    return promise;
  }

  private handleError(error: any) {
    return Promise.reject(error.message || error);
  }
}
