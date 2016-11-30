import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'options.html',
})

export class ProfileOptionsPage {
	constructor(public viewCtrl: ViewController) {}

	ionViewWillLoad() {}

	close() {
		this.viewCtrl.dismiss();
	}
}