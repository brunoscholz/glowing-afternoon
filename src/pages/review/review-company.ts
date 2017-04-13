import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'review-company.html',
})
export class ReviewCompanyPage {
  product: any;

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
    this.product = navParams.get("item");

    //let today = new Date();

    this.rating = 0;
    this.attendance = 1;
    this.price = 1;

    this.title = '';
    this.description = '';

    this.ratingRange = {
        lower: 0,
        upper: 10
    };
  }

  save(): void {
    let rate = this.rating + this.attendance * 1000 + this.price * 100;

    let review = {
        ReviewFact: {
          action: 'addReview',
          offerId: this.product.offerId,
          buyerId: 'logged',
          sellerId: '',
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
}
