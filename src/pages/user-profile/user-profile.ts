import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfile {
  public items:any;
  user: any;

  constructor(public navCtrl: NavController, public http: Http) {
    this.http = http;
      //this.http.get("http://api.randomuser.me/?results=10")
      this.http.get("/randomuserapi/?results=10")
        .subscribe(data =>{
          //console.log(data['_body']);
         this.items=JSON.parse(data['_body']).results;//Bind data to items object
        },error=>{
            console.log(error);// Error getting the data
        } );
  }

  buttonClick(event){
    console.log("button clicked");
    console.log(event);
  }
 
  itemClicked(event,itemData){
    console.log("item clicked");
    console.log(event);
    console.log(itemData);
  }
}
