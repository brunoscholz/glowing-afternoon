import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'user-options.html',
})
export class UserOptionsPage {
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
}