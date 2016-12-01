import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'options.html',
})

export class ProfileOptionsPage {
	list: any;

	constructor(public viewCtrl: ViewController, params: NavParams) {
		this.list = params.data.profiles;
	}

	ionViewWillLoad() {}

	close(id, type) {
		this.viewCtrl.dismiss({ type: type, id: id });
	}
}