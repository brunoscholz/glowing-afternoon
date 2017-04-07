import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'modal.html',
})
export class ProfileModalPage {
  userProfiles: any;
  selected;

  constructor(
  	private navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController
  ) {
    this.userProfiles = navParams.get("userProfiles");
  }

  save() {
    if(this.selected != null || this.selected != undefined) {
      //send back the chosen entire profile
      this.viewCtrl.dismiss(this.selected);
    }
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }
}