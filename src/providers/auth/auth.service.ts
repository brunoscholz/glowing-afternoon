import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Response } from '@angular/http';
import { APIService } from '../api/api.service';
import { DataService } from '../data/data.service';
import { Facebook } from 'ionic-native';
import { Subject } from 'rxjs/Rx';

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
    return this.doFbLogin();
  }

  doFbLogin() {
    let permissions = new Array();
    //let nav = this.navCtrl;
    //the permissions your facebook app needs from the user
    permissions = ["public_profile"];

    return Facebook.login(permissions)
    .then(function(response) {
      let userId = response.authResponse.userID;
      let params = new Array();

      //Getting name and gender properties
      Facebook.api("/me?fields=name,email,gender", params)
      .then(function(user) {
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info, let's save it in the NativeStorage
        /*this.storeUser({
          name: user.name,
          email: user.email,
          gender: user.gender,
          picture: user.picture
        });*/
        return this.authenticate(user);
      });
    }, function(error){
      console.log(error);
    });
  }

  doFbLogout() {
    Facebook.logout()
    .then(function(response) {
      //user logged out so we will remove him from the NativeStorage
      this.removeUserCredentials('userfb');
    });
  }

  storeUser(data, fb = false) {
    if(!fb)
      this.dataService.lstorageSave('user', JSON.stringify(data));
    else
      this.dataService.lstorageSave('userfb', JSON.stringify(data));
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
    let token = this.dataService.lstorageLoad('ondetemTK');
    //let user = JSON.parse(this.dataService.lstorageLoad('user'));
    /*let pref = null;
    if(user.preferred)
      pref = user.preferred;*/

    let promise = new Promise((resolve, reject) => {
      if(!token) {
        this._logged.next(false);
        resolve(null);
      }

      this.api.add({
        controller: 'auth/signin',
        body: { token: encodeURIComponent(token) },
        query: {}
      })
        .map((res: Response) => res.json())
        .subscribe(data => {
          if(data.status == 200) {
            this.storeUserCredentials(token);
            let usr = data.data[0];
            //usr.preferred = pref;
            this.storeUser(usr);
            this._logged.next(usr);
            resolve(usr);
          }
          else {
            this._logged.next(null);
            reject(data.error);
          }
        });
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
        body: user,
        query: {}
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