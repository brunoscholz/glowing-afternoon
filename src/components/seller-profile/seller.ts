import { Component, Input, OnInit } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';

import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { CatalogPage } from '../../pages/catalog/catalog';
import { SellerMapPage } from '../../pages/company-detail/map-page';
import { ReviewCompanyPage } from '../../pages/review/review-company';

import { IUser, ISeller } from '../../providers/data/interfaces';
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

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public util: UtilProvider,
              public dataService: DataService)
  {}

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
    self.util.presentLoading('Aguarde..');
    let fav = {
      FollowFact: {
        action: 'follow',
        userId: self.user.buyer.buyerId,
        sellerId: self.company.sellerId,
        buyerId: ''
      }
    }
    self.dataService.addSocialAction({
      controller: 'follow-facts',
      data: fav
    })
    .then(() => {
      let toast = self.util.getToast('Você está seguindo ' + self.company.name);
      toast.present();
    }, (err) => {
      console.log(err);
      self.util.dismissLoading();
      self.util.notifyError(err);
    });
  }

  unfollow() {
    let self = this;
    self.util.presentLoading('Aguarde..');
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
    self.dataService.addSocialAction({
      controller: 'follow-facts/' + ff.followFactId,
      data: fav
    })
    .then(() => {
      let toast = self.util.getToast('Você parou de seguir ' + self.company.name);
      toast.present();
    }, (err) => {
      console.log(err);
      self.util.dismissLoading();
      self.util.notifyError(err);
    });
  }

  addReview() {
    let alert = this.util.doAlert('Avaliação', 'Funcionalidade ainda não disponível para Empresas.', 'OK');
    alert.present();
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
    self.util.presentLoading('Aguarde..');

    review.ReviewFact.buyerId = self.user.buyer.buyerId;
    this.dataService.addSocialAction({
      controller: 'review-facts',
      data: review
    })
    .then((data) => {
      if(data['status'] == 200) {
        let toast = self.util.getToast('Você ganhou '+data['credit']+' moedas pela avaliação. Obrigado!');
        //self.product.reviews.push(review);
        //this.dataService.creditUser(10);
        toast.present();
        self.util.dismissLoading();
      }
    }, (err) => {
      console.log(err);
      self.util.notifyError(err);
      self.util.dismissLoading();
    });
  }

  addReviewPlus() {
    let alert = this.util.doAlert('Cliente Oculto', 'Funcionalidade ainda não disponível.', 'OK');
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