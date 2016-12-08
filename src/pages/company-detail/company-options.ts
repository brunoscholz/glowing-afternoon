import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

@Component({
  templateUrl: 'company-options.html',
})
export class CompanyOptionsPage {
  company: any = [];
  sended: boolean = false;

  constructor(
    public viewCtrl: ViewController,
    params: NavParams,
    public dataService: DataService,
    public util: UtilProvider
  ) {
    this.company = params.data.company;
  }

  close(id, type) {
    //this.viewCtrl.dismiss();
  }

  follow() {
    let fav = {}
    this.dataService.addSocialAction({
      controller: 'follow-facts',
      data: fav
    })
    .then(() => {
      let toast = this.util.getToast('Você passou a seguir ' + this.company.name);
      toast.present();
      this.viewCtrl.dismiss();
    });
  }

  addReview() {
    this.viewCtrl.dismiss('addReview');
  }
}