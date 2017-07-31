import { Component, Input, OnInit } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';

import { CatalogPage } from '../../../offer/pages/catalog/catalog';
import { SellerMapPage } from '../../../maps/pages/seller-map/map-page';
import { ReviewCompanyPage } from '../../../social/pages/review/review-company';

import { AppService } from '../../../common/services/app.service';
import { SocialService } from '../../../social/services/social.service';
import { UserService } from '../../services/user.service';


import { IUser, ISeller } from '../../../common/models/interfaces';

import _ from 'underscore';

@Component({
  selector: 'seller-profile',
  templateUrl: 'seller.html'
})
export class SellerProfileCmp implements OnInit {
  @Input('feed') company: ISeller;
  @Input('user') user: IUser;
  bgImage: string;
  //@Output('notify') notify: EventEmitter<IProfile> = new EventEmitter<IProfile>();

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public theApp: AppService,
    public userService: UserService,
    public socialService: SocialService
  ) {

  }

  ngOnInit() {
    this.bgImage = this.company.picture.cover;
  }

  gotoMap() {
    let modal = this.modalCtrl.create(SellerMapPage, {company: this.company});
    modal.onDidDismiss(() => {
      
    });

    modal.present();
  }

  follow() {
    let self = this;
    self.theApp.util.presentLoading('Aguarde..');
    let fav = {
      FollowFact: {
        action: 'follow',
        userId: self.user.buyer.buyerId,
        sellerId: self.company.sellerId,
        buyerId: ''
      }
    }
    self.socialService.setFollow({
      data: fav
    })
    .then(() => {
      self.theApp.util.presentToast('Você está seguindo ' + self.company.name);
    }, (err) => {
      console.log(err);
      self.theApp.util.dismissLoading();
      self.theApp.notifyError(err);
    });
  }

  unfollow() {
    let self = this;
    self.theApp.util.presentLoading('Aguarde..');
    let fav = {
      FollowFact: {
        action: 'unfollow',
        userId: self.user.buyer.buyerId,
        sellerId: self.company.sellerId,
        buyerId: '',
        status: 'REM'
      }
    }
    let ff = _.findWhere(self.user.buyer.following, { sellerId: self.company.sellerId });
    self.socialService.setFollow({
      followId: ff.followFactId,
      data: fav
    })
    .then(() => {
      self.theApp.util.presentToast('Você parou de seguir ' + self.company.name);
    }, (err) => {
      console.log(err);
      self.theApp.util.dismissLoading();
      self.theApp.notifyError(err);
    });
  }

  addReview() {
    /*let alert = this.util.doAlert('Avaliação', 'Funcionalidade ainda não disponível para Empresas.', 'OK');
    alert.present();*/
    let modal = this.modalCtrl.create(ReviewCompanyPage, { item: this.company });
    modal.onDidDismiss(review => {
      if(review){
        this.saveReview(review);
      }
    });

    modal.present();
  }

  saveReview(review) {
    let self = this;
    self.theApp.util.presentLoading('Aguarde..');

    review.ReviewFact.buyerId = self.user.buyer.buyerId;
    this.socialService.setReview({
      data: review
    })
    .then((data) => {
      if(data['status'] == 200) {
        self.theApp.util.presentToast('Você ganhou '+data['credit']+' moedas pela avaliação. Obrigado!');
        //self.product.reviews.push(review);
        //this.dataService.creditUser(10);
        self.theApp.util.dismissLoading();
      }
    }, (err) => {
      console.log(err);
      self.theApp.notifyError(err);
      self.theApp.util.dismissLoading();
    });
  }

  addReviewPlus() {
    let alert = this.theApp.util.doAlert('Cliente Oculto', 'Funcionalidade ainda não disponível.', 'OK');
    alert.present();
  }

  gotoCatalog(e) {
    let modal = this.modalCtrl.create(CatalogPage, { item: this.company });
    modal.onDidDismiss(res => {
      
    });

    modal.present();
  }

  gotoContact(e) {}
  gotoInfo(e) {}
}