import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'review.html',
})
export class ReviewPage {
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

  book(){
    /*let newReservation = {
        _id: this.room._id,
        from: this.details.from.substring(0,10),
        to: this.details.from.substring(0,10)
    }

    let loading = this.loadingCtrl.create({
        content: "Booking room..."
    });

    loading.present();

    this.roomsService.reserveRoom(newReservation).then((res) => {

        loading.dismiss();
        this.nav.popToRoot();

    }, (err) => {
        console.log(err);
    });*/
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
