import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'product-options.html',
})
export class ProductOptionsPage {
  canAdd: boolean = true;

  constructor(
    public viewCtrl: ViewController,
    params: NavParams
  ) {
    this.canAdd = params.data.canAdd;
  }

  close(id, type) {
    //this.viewCtrl.dismiss();
  }

  favorite() {   
    this.viewCtrl.dismiss('addToList');
  }

  unfavorite() {
    this.viewCtrl.dismiss('removeFromList');
  }

  addReview() {
    this.viewCtrl.dismiss('addReview');
  }

  share() {
    this.viewCtrl.dismiss('share');
  }
}