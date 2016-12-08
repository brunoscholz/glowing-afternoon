/**
 * CompanyDetailPage class
 *
 * Detail information about one company
 * with all it's offers and reviews. The item comes from navParams
 * 
 * It subscribes to dataService.reviews$ and on change
 * it loads the results into the @property review based on the query
 * in the load method
 *
*/
import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ModalController, PopoverController } from 'ionic-angular';
import { ModelPage } from '../model-page';
// import { ReviewPage } from '../review/review';
// import { ReviewDetailPage } from '../review-detail/review-detail';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { UserOptionsPage } from './user-options';

import { ViewStatusEnum } from '../../providers/utils/enums';
import { IBuyer } from '../../providers/data/interfaces';
//import _ from 'underscore';

@Component({
  templateUrl: 'user-detail.html',
})
export class UserDetailPage extends ModelPage {
  buyer: IBuyer;
  bgImage: string;

  constructor(public navCtrl: NavController,
              navParams: NavParams,
              public acCtrl: ActionSheetController,
              public modCtrl: ModalController,
              public popoverCtrl: PopoverController,
              public dataService: DataService,
              public util: UtilProvider
  ) {
    super("Buyer Details", dataService, util);
    this.buyer = navParams.get('user');
    this.bgImage = this.buyer.picture.cover;
  }

  ionViewDidLoad() {
    this.doReset(this.buyer.name);
    this.load();
  }

  load() {
    //var self = this;
    this.doChangeView(ViewStatusEnum.Empty);
    this.util.presentLoading('Buscando...');

    /*this.dataService.getPretty({
      controller: 'catalog',
      url: 'sellers/catalog/' + self.company.sellerId
    }).then((data: Array<IOffer>) => {
      self.offers = data;
      self.changeViewState();
      if(self.refresher)
        self.refresher.complete();
    }, (err) => {
      console.log(err);
    });*/
  }

  changeViewState() {
    if(this.buyer) // && this.offers
      this.doChangeView(ViewStatusEnum.Full);
    else
      this.doChangeView(ViewStatusEnum.Empty);
    this.util.dismissLoading();
  }

  doRefresh(refresher) {
    //this.refresher = refresher;
    this.load();
  }

  follow(event) {
    /*this.dataService.like(this.company).subscribe(
        likes => {
          this.company.likes = likes;
        }
    );*/
  }

  moreOptions(myEvent) {
    let popover = this.popoverCtrl.create(UserOptionsPage, { buyer: this.buyer });
    popover.onDidDismiss(() => {
      //if(act == 'addReview') {}
        
    });
    popover.present({
      ev: myEvent
    });
  }
}
