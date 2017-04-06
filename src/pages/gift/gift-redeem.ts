/***
 * Store page that show all gifts available
 * v1.5.7 ready
 */

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//import { ProductDetailPage } from '../product-detail/product-detail';
import { GiftConfirmPage } from '../gift/gift-confirm';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { ViewStatusEnum } from '../../providers/utils/enums';
import { IOffer } from '../../providers/data/interfaces';
import { ModelPage } from '../model-page';

import _ from 'underscore';

@Component({
  templateUrl: 'gift-redeem.html',
})
export class GiftRedeemPage extends ModelPage {

  constructor(public navCtrl: NavController,
              navParams: NavParams,
              public dataService: DataService,
              public util: UtilProvider
  ) {
    super('Loja', dataService, util);
  }

  ionViewDidLoad() {
   
  }

  
}
