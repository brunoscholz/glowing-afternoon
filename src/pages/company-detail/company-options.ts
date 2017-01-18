import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'company-options.html',
})
export class CompanyOptionsPage {
  canFollow: boolean = true;

  constructor(
    public viewCtrl: ViewController,
    params: NavParams,
  ) {
    this.canFollow = params.data.canFollow;
  }

  close(id, type) {
    //this.viewCtrl.dismiss();
  }

  follow() {
    this.viewCtrl.dismiss('follow');
  }

  unfollow() {
    this.viewCtrl.dismiss('unfollow');
  }

  addReview() {
    this.viewCtrl.dismiss('addReview');
  }

  addReviewPlus() {
    this.viewCtrl.dismiss('addReviewPlus');
  }
}