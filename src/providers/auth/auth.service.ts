import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Response } from '@angular/http';
import { APIService } from '../api/api.service';
import { DataService } from '../data/data.service';
import { Facebook } from 'ionic-native';

@Injectable() 
export class AuthService {
  isLoggedin: boolean = false;
  AuthToken: any;
  FB_APP_ID: number = 806581699497571;

  constructor(public platform: Platform, public api: APIService, public dataService: DataService) {
    this.isLoggedin = false;
    this.AuthToken = null;
    this.api.Init("auth");

    //this.loadUserCredentials();
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
    this.dataService.lstorageSave('ondetemTK', token)
    this.useCredentials(token);
  }    

  useCredentials(token) {
    this.isLoggedin = true;
    this.AuthToken = token;
  }

  loadUserCredentials() {
    var token = this.dataService.lstorageLoad('ondetemTK');
    return new Promise(resolve => {
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
            resolve(data.data[0]);
          }
          else
            resolve(null);
        });
    });
  }
  
  destroyUserCredentials() {
    this.isLoggedin = false;
    this.AuthToken = null;
    this.dataService.lstorageClear();
  }

  removeUserCredentials(item) {
    this.dataService.lstorageRemove(item);
  }

  authenticate(user) {

    //var creds = "name=" + user.name + "&password=" + user.password;
    return new Promise(resolve => {
      this.api.add({
        controller: 'auth/signin',
        body: user,
        query: {}
      })
        .map((res: Response) => res.json())
        .subscribe(data => {
          if(data.status == 200) {
            this.storeUserCredentials(data.token)
            this.storeUser(data.data);
            resolve(true);
          }
          else
            resolve(false);
        });
      });
  }

  register(user) {
    console.log(user);
    return new Promise(resolve => {
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
            resolve(false);
        });
      });
    /*var creds = "name=" + user.name + "&password=" + user.password;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    
    return new Promise(resolve => {
      this.http.post('http://localhost:3333/adduser', creds, {headers: headers})
      .subscribe(data => {
        if(data.json().success){
          resolve(true);
        }
        else
          resolve(false);
      });
    });*/
  }

  getinfo() {
    /*return new Promise(resolve => {
      var headers = new Headers();
      this.loadUserCredentials();
      console.log(this.AuthToken);
      headers.append('Authorization', 'Bearer ' +this.AuthToken);
      this.http.get('http://localhost:3333/getinfo', {headers: headers})
      .subscribe(data => {
        if(data.json().success)
          resolve(data.json());
        else
          resolve(false);
      });
    })*/
  }
  
  logout() {
    this.destroyUserCredentials();
  }
}