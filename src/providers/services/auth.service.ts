import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { APIService } from './api.service';
import { DataService } from './data.service';

@Injectable() 
export class AuthService {
    isLoggedin: boolean = false;
    AuthToken: any;

    constructor(public api: APIService, public dataService: DataService) {
        this.isLoggedin = false;
        this.AuthToken = null;
        this.api.Init("auth");

        //this.loadUserCredentials();
        //console.log(this.AuthToken);
    }

    storeUserCredentials(token, data) {
        window.localStorage.setItem('ondetemTK', token);
        this.dataService.fetchUser(data[0]);
        this.useCredentials(token);
    }    

    useCredentials(token) {
        this.isLoggedin = true;
        this.AuthToken = token;
    }

    loadUserCredentials() {
        var token = window.localStorage.getItem('ondetemTK');
        return new Promise(resolve => {
            this.api.add({
                controller: 'auth/signin',
                body: { token: encodeURIComponent(token) },
                query: {}
            })
                .map((res: Response) => res.json())
                .subscribe(data => {
                    if(data.status == 200) {
                        this.storeUserCredentials(token, data.data);
                        resolve(true);
                    }
                    else
                        resolve(false);
                });
        });
    }
    
    destroyUserCredentials() {
        this.isLoggedin = false;
        this.AuthToken = null;
        window.localStorage.clear();
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
                        this.storeUserCredentials(data.token, data.data);
                        resolve(true);
                    }
                    else
                        resolve(false);
                });
            });
    }

    register(user) {
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