import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, ActionSheetController } from 'ionic-angular';
import { DataService } from '../../providers/data/data.service';
import { AuthService } from '../../providers/auth/auth.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { IUser } from '../../providers/data/interfaces';

@Component({
  templateUrl: 'user-options.html',
})
export class UserOptionsPage {
  buyer: any = [];
  canFollow: boolean = true;

  constructor(
    public viewCtrl: ViewController,
    private navCtrl: NavController,
    params: NavParams,
    public dataService: DataService,
    public auth: AuthService,
    public actionSheet: ActionSheetController,
    public util: UtilProvider
  ) {
    this.buyer = params.data.buyer;
    this.canFollow = params.data.canFollow;
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
          buyerId: self.buyer.buyerId,
          sellerId: ''
        }
      }
      self.dataService.addSocialAction({
        controller: 'follow-facts',
        data: fav
      })
      .then(() => {
        let toast = self.util.getToast('Você está seguindo ' + self.buyer.name);
        toast.present();
        self.viewCtrl.dismiss();
      }, (err) => {
        console.log(err);
        self.util.dismissLoading();
        self.viewCtrl.dismiss({err: err});
      });
    });
  }

  unfollow() {}

  /*addReview() {
    this.viewCtrl.dismiss('addReview');
  }*/
}