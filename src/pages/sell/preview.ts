import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, PopoverController, } from 'ionic-angular';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { ModelPage } from '../model-page';
import { RegisterPage } from './register';

import { IOffer } from '../../providers/data/interfaces';
//import _ from 'underscore';

@Component({
  templateUrl: 'preview.html',
})
export class PreviewPage extends ModelPage {
  company: any;
  bgImage: string;
  avImage: string;
  offers: IOffer[];
  sended: boolean = false;

  public base64CoverImage: string;
  public base64ThumbImage: string;

  constructor(public navCtrl: NavController,
              navParams: NavParams,
              public actionSheet: ActionSheetController,
              public popoverCtrl: PopoverController,
              public dataService: DataService,
              public util: UtilProvider
  ) {
    super("Company Details", dataService, util);
    this.company = dataService.getVisitingCompany();
    this.bgImage = this.company.picture.cover;
    this.avImage = this.company.picture.thumbnail;
  }

  ionViewDidLoad() {
    this.doReset(this.company.name);
    //this.load();
  }

  moreOptions(myEvent) {
    let popover = this.popoverCtrl.create(RegisterPage, { company: this.company });
    popover.onDidDismiss((update, dataUri) => {
      if(update == 'cover') {
        this.company.picture.cover = dataUri;
        this.bgImage = this.company.picture.cover;
      } else if(update == 'thumb') {
        this.company.picture.thumbnail = dataUri;
        this.avImage = this.company.picture.thumbnail;
      }
    });
    popover.present({
      ev: myEvent
    });
  }

}
