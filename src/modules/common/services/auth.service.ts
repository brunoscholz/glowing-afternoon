import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Response } from '@angular/http';
import { Facebook } from 'ionic-native';

import { Subject } from 'rxjs/Rx';

import { AppService } from './app.service';
//import { DataService } from './data.service';

import { IShare, IUser } from '../models/interfaces';

@Injectable()
export class AuthService {
  IS_AUTH: string = 'is_auth';
  USER_INFO: string = 'user_info';

  isAuth: boolean = false;
  userInfo: any;

  AuthToken: string = 'auth_token';
  FB_APP_ID: number = 806581699497571;

  // constructor
  constructor(
    public http: Http,
    public events: Events,
    public storage: Storage,
    public theApp: AppService
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
    return this.storage.get(this.IS_AUTH).then(value => {
      this.isAuth = value ? true : false;

      if (this.isAuth) {
        this.userInfo = this.getUser();
      }

      return this.isAuth;
    });
  }

  // get user
  getUser() {
    return this.storage.get(this.USER_INFO).then(value => {
      this.userInfo = JSON.parse(value);
      return this.userInfo;
    })
  }

  // log in
  logIn(params) {
    let userInfo: string = JSON.stringify(params);
    this.isAuth = true;
    this.userInfo = JSON.parse(userInfo);

    this.storage.set(this.IS_AUTH, true);
    this.storage.set(this.USER_INFO, userInfo);

    this.events.publish('auth:loggedIn');
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

  shareWithFacebook(data: IShare) {
    //var options = { method:"feed" };
    let promise = new Promise((resolve, reject) => {
      Facebook.getLoginStatus()
      .then((response) => {
        if (response.status == 'connected') {
          Facebook.showDialog({
            method: "share",
            href: "http://ondetem-gn.com.br/site/story/" + data.id,
            caption: data.caption,
            description: data.description,
            quote: data.quote,
            picture: data.picture,
            hashtag: '#ondetem'
          })
          .then((result) => {
            resolve(true);
          }, (error) => {
            reject(error);
          });
        }
        reject(new Error('Não conectado ao Facebook'));
      })
      .catch((err) => {
        this.theApp.notifyError(err);
      });
    });
    return promise;
  }

  /* NORMAL STUFF */
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
}
