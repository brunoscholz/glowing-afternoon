import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Response } from '@angular/http';
import { APIService } from '../api/api.service';
import { DataService } from '../data/data.service';
import { Facebook } from 'ionic-native';
import { Subject } from 'rxjs/Rx';
import { UtilProvider } from '../utils/util.provider';
import { IShare, IUser } from '../data/interfaces';
import 'rxjs/Rx';

@Injectable() 
export class AuthService {
  isLoggedin: boolean = false;
  private _logged: any;
  AuthToken: any;
  FB_APP_ID: number = 806581699497571;

  get loggedIn$() { return this._logged.asObservable(); }

  constructor(public platform: Platform,
              public api: APIService,
              public dataService: DataService,
              public util: UtilProvider
  ) {
    this.isLoggedin = false;
    this._logged = new Subject();
    this.AuthToken = null;
    this.api.Init("auth");
    //console.log(this.AuthToken);
  }

  Init() {
    this.platform.ready().then(() => {
      
    });

    let self = this;
    let promise = new Promise((resolve, reject) => {
      return self.checkAuthentication();
      /*Facebook.getLoginStatus()
      .then((response) => {
        // if connected save userFB
        // if token isnt found, but userFB is authenticate with it
        
      }, (error) => {
        reject(error);
      });*/
    });
    return promise;
  }

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
        return self.authenticate(usr);
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
    console.log('chainFbAuthenticate');
    let self = this;
    let promise = new Promise((resolve, reject) => {
      if (response.status === 'connected') {
        resolve(response.authResponse);
      } else {
        return self.chainFbLogin();
      }
    });
    return promise;
  }

  chainFbGetInfo(response) {
    console.log('chainFbGetInfo');
    let self = this;
    let params = ['email'];
    let userId = response.userID;
    let promise = new Promise((resolve, reject) => {
    
      Facebook.api("/me?fields=id,name,email", params)
      .then((user) => {
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        let usr = {
          name: user.name,
          email: user.email,
          gender: user.gender,
          picture: user.picture,
          fbId: userId
        };
        self.storeUser(usr, 'userFB');
        resolve(usr);
      }, (error) => {
        reject(error);
      });

    });
    return promise;
  }

  chainFbLogin() {
    console.log('chainFbLogin');
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
        reject(error);
      });
    });
    return promise;
  }

  chainAuthenticate(usr) {
    console.log('chainAuthenticate');
    let promise = new Promise((resolve, reject) => {
      console.log(usr);
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
      this.api.add({
        controller: 'auth/forgot-password',
        body: user,
      })
        .map((res: Response) => res.json())
        .subscribe(data => {
          if(data.status == 200) {
            resolve(true);
          }
          else
            reject(data.error);
        });
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
        this.util.notifyError(err);
      });
    });
    return promise;
  }

  /*

  {
    method: "share",
    href: "http://example.com",
    caption: "Such caption, very feed.",
    description: "Much description",
    picture: 'http://example.com/image.png'
  }

  {
    method: "feed",
    link: "http://example.com",
    caption: "Such caption, very feed."
  }

  {
    method: "send",
    caption: "Check this out.",
    link: "http://example.com",
    description: "The site I told you about",
    picture: "http://example.com/image.png"
  }

  {
    method: "apprequests",
    message: "Come on man, check out my application.",
    data: data,
    title: title,
    actionType: 'askfor',
    filters: 'app_non_users'
  }

  facebookConnectPlugin.showDialog( 
    {
        method: "feed",
        picture:'https://www.google.co.jp/logos/doodles/2014/doodle-4-google-2014-japan-winner-5109465267306496.2-hp.png',
        name:'Test Post',
        message:'First photo post',    
        caption: 'Testing using phonegap plugin',
        description: 'Posting photo using phonegap facebook plugin'
    }, 
    function (response) { alert(JSON.stringify(response)) },
    function (response) { alert(JSON.stringify(response)) });
  */

  checkAuthentication() {
    let self = this;
    return new Promise((resolve, reject) => {
      //Load token if exists
      self.dataService.storageLoad('ondetemTK')
      .then((tk: string) => {
        let body = { 'AuthModel[token]': encodeURIComponent(tk) };
        return self.authenticate(body);
      })
      .then((res) => {
        return self.dataService.storageLoad('user');
      })
      .then((usr: string) => {
        resolve(<IUser>JSON.parse(usr));
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  authenticate(user) {
    console.log('authenticate');
    let promise = new Promise((resolve, reject) => {
      this.api.add({
        controller: 'auth/signin',
        body: user
      })
        .map((res: Response) => res.json())
        .subscribe(data => {
          if(data.status == 200) {
            this.storeUserCredentials(data.token)
            this.storeUser(data.data[0]);
            //this._logged.next(data.data[0]);
            resolve(true);
          }
          else {
            //this._logged.next(null);
            reject(data.error);
          }
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  register(user) {
    let promise = new Promise((resolve, reject) => {
      this.api.add({
        controller: 'auth/signup',
        body: user
      })
        .map((res: Response) => res.json())
        .subscribe(data => {
          if(data.status == 200) {
            this.storeUserCredentials(data.token);
            this.storeUser(data.data[0]);
            //this._logged.next(data.data[0]);
            resolve(true);
          }
          else {
            //this._logged.next(null);
            reject(data.error);
          }
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  setUserInfo(data: any, name: string) {
    this.dataService.storageSave(name, JSON.stringify(data))
    .then(() => {

    });
  }

  getUserInfo() {
    let promise = new Promise((resolve, reject) => {
      this.dataService.storageLoad('user')
      .then((u: string) => {
        let usr = <IUser>JSON.parse(u);
        resolve(usr);
      }, (err) => {
        return this.checkAuthentication();
      });
    });
    return promise;
  }

  storeUser(data, name='user') {
    this.setUserInfo(data, name);
  }

  storeUserCredentials(token) {
    this.dataService.storageSave('ondetemTK', token)
    .then(() => {
      this.useCredentials(token);
    });
  }    

  useCredentials(token) {
    this.isLoggedin = true;
    this.AuthToken = token;
  }

  destroyUserCredentials() {
    this.isLoggedin = false;
    //this._logged.next(false);
    this.AuthToken = null;
    this.dataService.storageClear();
  }

  removeUserCredentials(item) {
    this.dataService.storageRemove(item);
  }

  getinfo() {
    
  }
  
  logout() {
    this.destroyUserCredentials();
  }
}