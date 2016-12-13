import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, ActionSheetController } from 'ionic-angular';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

@Component({
  templateUrl: 'product-options.html',
})
export class ProductOptionsPage {
  product: any = [];
  user: any;

  constructor(
    public viewCtrl: ViewController,
    private navCtrl: NavController,
    params: NavParams,
    public dataService: DataService,
    public actionSheet: ActionSheetController,
    public util: UtilProvider
  ) {
    this.product = params.data.product;
    this.dataService.getUser()
    .then((usr) => {
      if(usr)
        this.user = usr;
      else {
        this.util.notifyError('Não foi possível recuperar dados do usuário.');
        this.viewCtrl.dismiss();
      }
    })
  }

  close(id, type) {
    //this.viewCtrl.dismiss();
  }

  favorite() {
    let fav = {
      actionId: 0,
      buyerId: this.user.buyer.buyerId,
      offerId: this.product.offerId
    };
    this.dataService.addSocialAction({
      controller: 'favorite-facts',
      data: fav
    })
    .then(() => {
      let toast = this.util.getToast('Adicionado!');
      toast.present();
      this.viewCtrl.dismiss();
    });
  }

  addReview() {
    this.viewCtrl.dismiss('addReview');
  }

  share(event) {
    let action = this.actionSheet.create({
      buttons: [
        {
          text: 'Text',
          handler: () => {
            console.log('Text clicked');
          }
        },
        {
          text: 'Email',
          handler: () => {
            console.log('Email clicked');
          }
        },
        {
          text: 'Facebook',
          handler: () => {
            console.log('Facebook clicked');
          }
        },
        {
          text: 'Twitter',
          handler: () => {
            console.log('Twitter clicked');
          }
        },
        {
          text: 'Cancel',
          style: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    action.present();
  }
}