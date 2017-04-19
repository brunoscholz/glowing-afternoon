import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'review-company.html',
})
export class ReviewCompanyPage {
  company: any;

  title: any;
  description: any;
  rating: any;
  ratingRange: any;
  attendance: any;
  price: any;

  constructor(
  	private navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController
  ) {
    this.company = navParams.get("item");

    //let today = new Date();
    // prepare for review plus - cliente oculto


    this.rating = 1;
    this.attendance = 1;
    this.price = 1;

    this.title = '';
    this.description = '';

    this.ratingRange = {
        lower: 0,
        upper: 5
    };
  }

  save(): void {
    let rate = this.rating + this.attendance * 1000 + this.price * 100;

    let review = {
        ReviewFact: {
          action: 'addReview',
          offerId: '',
          buyerId: 'logged',
          sellerId: this.company.sellerId,
          rating: rate
        },
        Review: {
          title: this.title,
          body: this.description
        }
    };

    this.viewCtrl.dismiss(review);
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }

  onRate(grade, type) {
    if (type == 'general') {
      this.rating = grade;
    }
    else if (type == 'attendance') {
      this.attendance = grade;
    }
    else if (type == 'price') {
      this.price = grade;
    }
  }
}
