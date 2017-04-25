import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { IProfile } from '../../modules/common/models/interfaces';

import _ from 'underscore';

@Component({
  templateUrl: 'modal.html',
})
export class ProfileModalPage {
  userProfiles: IProfile[];
  selected: IProfile;

  constructor(
  	private navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController
  ) {
    this.userProfiles = navParams.get("userProfiles");
  }

  save() {
    if(this.selected != null || this.selected != undefined) {
      let ret = _.findWhere(this.userProfiles, {id: this.selected});
      this.viewCtrl.dismiss(ret);
    }
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }
}