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
import { AuthService } from '../../providers/auth/auth.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { CompanyOptionsPage } from './company-options';
import { CatalogPage } from '../catalog/catalog';

import { ViewStatusEnum } from '../../providers/utils/enums';
import { ISeller, IOffer, IUser } from '../../providers/data/interfaces';
import _ from 'underscore';

@Component({
  templateUrl: 'company-detail.html',
})
export class CompanyDetailPage extends ModelPage {
  company: ISeller;
  user: IUser;
  bgImage: string;
  canFollow: boolean = true;
  offers: IOffer[];

  constructor(public navCtrl: NavController,
              navParams: NavParams,
              public acCtrl: ActionSheetController,
              public modCtrl: ModalController,
              public popoverCtrl: PopoverController,
              public dataService: DataService,
              public auth: AuthService,
              public util: UtilProvider
  ) {
    super("Company Details", dataService, util);
    this.company = navParams.get('company');
    this.bgImage = this.company.picture.cover;
  }

  ionViewDidLoad() {
    this.doReset(this.company.name);
    this.load();

    let self = this;
    self.auth.getUserInfo()
    .then((user: IUser) => {
      self.user = user;
      let ids = _.pluck(user.buyer.following, 'sellerId');
      //self.canFollow = self.buyer.buyerId !== user.buyer.buyerId;
      //self.canFollow = self.canFollow && !_.contains(ids, self.buyer.buyerId);
      self.canFollow = !_.contains(ids, self.company.sellerId);
    });
  }

  load() {
    var self = this;
    this.doChangeView(ViewStatusEnum.Empty);
    this.util.presentLoading('Buscando...');

    this.dataService.getPretty({
      controller: 'catalog',
      url: 'sellers/catalog/' + self.company.sellerId
    }).then((data: Array<IOffer>) => {
      self.offers = data;
      self.changeViewState();
      if(self.refresher)
        self.refresher.complete();
    }, (err) => {
      console.log(err);
    });
  }

  changeViewState() {
    if(this.company) // && this.offers
      this.doChangeView(ViewStatusEnum.Full);
    else
      this.doChangeView(ViewStatusEnum.Empty);
    this.util.dismissLoading();
  }

  doRefresh(refresher) {
    //this.refresher = refresher;
    this.load();
  }

  moreOptions(myEvent) {
    let popover = this.popoverCtrl.create(CompanyOptionsPage, { canFollow: this.canFollow });
    popover.onDidDismiss((act) => {
      if(act == 'follow')
        this.follow();
      if(act == 'unfollow')
        this.unfollow();
      if(act == 'addReview')
        this.addReview();
      if(act == 'addReviewPlus')
        this.addReviewPlus();
    });
    popover.present({
      ev: myEvent
    });
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
    /*let modal = this.modCtrl.create(ReviewPage, { item: this.product });
    modal.onDidDismiss(review => {
      if(review){
        this.saveReview(review);
      }
    });

    modal.present();*/
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
    let modal = this.modCtrl.create(CatalogPage, { item: this.company, offers: this.offers });
    modal.onDidDismiss(review => {
      
    });

    modal.present();
  }

  deleteReview(review) {
    //Remove locally
    /*let index = this.company.reviews.indexOf(review);
    if(index > -1){
      this.company.reviews.splice(index, 1);
    }*/
    //Remove from database
    //this.reviewService.deleteReview(review._id);
  }

  reviewTapped(event, item) {
    /*this.navCtrl.push(ReviewDetailPage, {
      review: item,
      company: this.company
    });*/
  }
}
