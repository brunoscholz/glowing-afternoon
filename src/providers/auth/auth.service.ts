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

  constructor(public platform: Platform, public api: APIService, public dataService: DataService) {
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
    this.doFbLogin();
  }

  doFbLogin() {
    let permissions = new Array();
    //let nav = this.navCtrl;
    //the permissions your facebook app needs from the user
    permissions = ["public_profile"];


    Facebook.login(permissions).then(function(response) {
      let userId = response.authResponse.userID;
      let params = new Array();

      //Getting name and gender properties
      Facebook.api("/me?fields=name,email,gender", params)
      .then(function(user) {
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info, let's save it in the NativeStorage
        this.storeUser({
          name: user.name,
          email: user.email,
          gender: user.gender,
          picture: user.picture
        }, true);
      })
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
    var token = this.dataService.lstorageLoad('ondetemTK');
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
            this.storeUser(data.data[0]);
            this._logged.next(data.data[0]);
            resolve(data.data[0]);
          }
          else
            reject(data.error);
        });
    });
    return promise;
  }
  
  destroyUserCredentials() {
    this.isLoggedin = false;
    this._logged.next(false);
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
          else
            reject(data.error);
        });
    });
    return promise;
  }

  register(user) {
    let promise = new Promise((resolve, reject) => {
      this.api.add({
        controller: 'auth/signup',
        body: user,
      })
        .map((res: Response) => res.json())
        .subscribe(data => {
          if(data.status == 200) {
            this.storeUserCredentials(data.token);
            this.storeUser(data.data);
            resolve(true);
          }
          else
            reject(data.error);
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