import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Response } from '@angular/http';
import { APIService } from '../api/api.service';
import { DataService } from '../data/data.service';
import { Facebook } from 'ionic-native';
import { Subject } from 'rxjs/Rx';
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
              public dataService: DataService
  ) {
    this.isLoggedin = false;
    this._logged = new Subject();
    this.AuthToken = null;
    this.api.Init("auth");
    //console.log(this.AuthToken);

    this.platform.ready().then(() => {
      Facebook.browserInit(this.FB_APP_ID, "v2.8");
    });
  }

  connectWithFacebook() {
    return this.doFbAuthenticate();
  }

  doFbAuthenticate() {
    let self = this;
    return Facebook.getLoginStatus()
    .then((response) => {
      if (response.status === 'connected') {
        return self.doFbGetInfo(response.authResponse);
      } else {
        return self.doFbLogin();
      }
    }, (err) => {
      console.log(err);
      return null;
    });
  }

  doFbGetInfo(response) {
    let self = this;
    let params = ['email'];
    let userId = response.userID;
    return Facebook.api("/me?fields=id,name,email", params)
    .then(function(user) {
      user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
      let usr = {
        name: user.name,
        email: user.email,
        gender: user.gender,
        picture: user.picture,
        fbId: userId
      };
      return self.authenticate(usr);
    }, function(error) {
      console.log(error);
      return null;
    });
  }

  doFbLogin() {
    let self = this;
    //the permissions your facebook app needs from the user
    //{scope: 'email,read_stream,publish_actions'}
    let permissions = ["public_profile", "email", "user_friends"];

    return Facebook.login(permissions)
    .then((response) => {
      //if (response.status == 'connected') 
      return self.doFbGetInfo(response.authResponse);
    }, function(error) {
      console.log(error);
      return null;
    });
  }

  doFbLogout() {
    Facebook.logout()
    .then(function(response) {
      //user logged out so we will remove him from the NativeStorage
      this.logout();
      this._logged.next(false);
    });
  }

  storeUser(data) {
      this.dataService.lstorageSave('user', JSON.stringify(data));
  }

  storeUserCredentials(token) {
    this.dataService.lstorageSave('ondetemTK', token);
    this.useCredentials(token);
  }    

  useCredentials(token) {
    this.isLoggedin = true;
    this.AuthToken = token;
  }

  loadUserCredentials() {
    let self = this;
    let token = this.dataService.lstorageLoad('ondetemTK');

    let promise = new Promise((resolve, reject) => {
      if(!token || token == undefined) {
        self._logged.next(false);
        reject('usuário não logado - token não encontrado');
      } else {
        self.authenticate({ token: encodeURIComponent(token) })
        .then((res) => {
          if(res) {
            let usr = JSON.parse(self.dataService.lstorageLoad('user'));
            resolve(usr);
          }
          else
            reject('autenticação falhou');
        }, (err) => {
          console.log(err);
        });
      }
    });
    return promise;
  }

  destroyUserCredentials() {
    this.isLoggedin = false;
    //this._logged.next(false);
    this.AuthToken = null;
    this.dataService.lstorageClear();
  }

  removeUserCredentials(item) {
    this.dataService.lstorageRemove(item);
  }

  authenticate(user) {
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
            this._logged.next(data.data[0]);
            resolve(true);
          }
          else {
            this._logged.next(null);
            reject(data.error);
          }
        });
    });
    return promise;
  }

  register(user) {
    let promise = new Promise((resolve, reject) => {
      this.api.add({
        controller: 'auth/signup',
        body: user,
        query: {}
      })
        .map((res: Response) => res.json())
        .subscribe(data => {
          if(data.status == 200) {
            this.storeUserCredentials(data.token);
            let res = data.data[0]
            this.storeUser(res);
            res['firstLogin'] = true;
            this._logged.next(res);
            resolve(true);
          }
          else {
            this._logged.next(null);
            reject(data.error);
          }
        });
    });
    return promise;
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

  getinfo() {
    
  }
  
  logout() {
    this.destroyUserCredentials();
  }
}