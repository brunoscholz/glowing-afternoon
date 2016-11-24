import { Component } from '@angular/core';
import { Nav } from 'ionic-angular';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';

import { TourPage } from '../tour/tour';

@Component({
  templateUrl: 'signup.html',
})
export class SignUpPage {

  constructor(private navCtrl: Nav, public auth: Auth, public user: User) {

  }

  SignUp() {
    //this.navCtrl.setRoot(TourPage);
    let details: UserDetails = {'email': 'hi@ionic.io', 'password': 'puppies123'};

		this.auth.signup(details).then(() => {
		  // `this.user` is now registered
		}, (err: IDetailedError<string[]>) => {
		  for (let e of err.details) {
		    if (e === 'conflict_email') {
		      alert('Email already exists.');
		    } else {
		      // handle other errors
		    }
		  }
		});
  }

}
