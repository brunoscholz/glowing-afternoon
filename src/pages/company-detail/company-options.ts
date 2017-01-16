import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { AuthService } from '../../providers/auth/auth.service';

import { IUser } from '../../providers/data/interfaces';

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
    public auth: AuthService,
    public util: UtilProvider
  ) {
    this.company = params.data.company;
  }

  close(id, type) {
    //this.viewCtrl.dismiss();
  }

  follow() {
    let self = this;
    self.util.presentLoading('Aguarde..');
    self.auth.getUserInfo()
    .then((user: IUser) => {
      let fav = {
        FollowFact: {
          action: 'follow',
          userId: user.buyer.buyerId,
          sellerId: self.company.sellerId,
          buyerId: ''
        }
      }
      self.dataService.addSocialAction({
        controller: 'follow-facts',
        data: fav
      })
      .then(() => {
        let toast = self.util.getToast('Você está seguindo ' + this.company.name);
        toast.present();
        self.viewCtrl.dismiss();
      }, (err) => {
        console.log(err);
        self.util.dismissLoading();
        self.viewCtrl.dismiss({err: err});
      });
    });
  }

  addReview() {
    this.viewCtrl.dismiss('addReview');
  }
}