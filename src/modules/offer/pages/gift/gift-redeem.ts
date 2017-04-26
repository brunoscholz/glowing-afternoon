/***
 * Store page that show all gifts available
 * v1.5.7 ready
 */

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//import { ProductDetailPage } from '../product-detail/product-detail';
//import { GiftConfirmPage } from '../gift/gift-confirm';

import { AppService } from '../../../common/services/app.service';
import { DataService } from '../../../common/services/data.service';

// import { ViewStatusEnum } from '../../../common/models/enums';
// import { IUser, IProfile, IBalance } from '../../../common/models/interfaces';
//import { ModelPage } from '../../../common/pages/model-page';

//import _ from 'underscore';

@Component({
  templateUrl: 'gift-redeem.html',
})
export class GiftRedeemPage { // extends ModelPage

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public dataService: DataService,
    public theApp: AppService
  ) {
    //super('Loja');
  }

  ionViewDidLoad() {
   
  }

  
}
