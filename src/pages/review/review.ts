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
  dateCreated: any;

  constructor(
  	private navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController
  ) {
    this.product = navParams.get("item");

    let today = new Date();

    this.title = '';
    this.description = '';
    this.rating = 0;

    this.ratingRange = {
        lower: 0,
        upper: 100
    };

    this.attendance = 'standard';
    this.price = 1;
    this.dateCreated = today.toISOString();
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

  findRooms() {
    /*let loading = this.loadingCtrl.create({
        content: "Finding rooms..."
    });

    loading.present();*/

    //loading.dismiss();
  }

  save(): void {
    let review = {
        id: 0,
        item: this.product.sku,
        authorId: 1,
        title: this.title,
        rating: this.rating,
        upvotes: 3,
        commentCount: 5,
        avg: 8,
        text: "Review text... maybe 400 characters max!<br>orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    };

    this.viewCtrl.dismiss(review);
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }
}
