import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, ActionSheetController } from 'ionic-angular';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

@Component({
  templateUrl: 'user-options.html',
})
export class UserOptionsPage {
  product: any = [];
  sended: boolean = false;

  constructor(
    public viewCtrl: ViewController,
    private navCtrl: NavController,
    params: NavParams,
    public dataService: DataService,
    public actionSheet: ActionSheetController,
    public util: UtilProvider
  ) {
    this.product = params.data.product;
  }

  close(id, type) {
    //this.viewCtrl.dismiss();
  }

  favorite() {
    this.viewCtrl.dismiss();
  }

  addReview() {
    this.viewCtrl.dismiss('addReview');
  }
}