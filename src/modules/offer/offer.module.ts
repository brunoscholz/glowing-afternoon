import { NgModule } from '@angular/core';
import { Platform, Events, ModalController } from 'ionic-angular';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';

import { AppService } from '../common/services/app.service';
import { UserService } from '../user/services/user.service';

import { OfferService } from './services/offer.service';

import { CategoryPage } from './pages/category/category';
import { PromotionPage } from './pages/promotion/promotion';
import { StorePage } from './pages/store/store';
import { CatalogPage } from './pages/catalog/catalog';

import { ProductPage } from './pages/product/product';
import { ProductDetailPage } from './pages/product-detail/product-detail';
import { GiftConfirmPage } from './pages/gift/gift-confirm';
import { GiftRedeemPage } from './pages/gift/gift-redeem';

import { OfferPostCmp } from './components/offer/offer';
import { OfferListCmp } from './components/offer-list/offer';
import { OfferGiftCmp } from './components/offer-gift/offer';
import { OfferPromoCmp } from './components/offer-promo/offer';

@NgModule({
  imports: [
    CommonModule,
    UserModule,
  ],
  declarations: [
    CategoryPage,
    PromotionPage,
    StorePage,
    CatalogPage,
    ProductPage,
    ProductDetailPage,
    GiftConfirmPage,
    GiftRedeemPage,
    OfferPostCmp,
    OfferListCmp,
    OfferGiftCmp,
    OfferPromoCmp,
  ],
  entryComponents: [
    CategoryPage,
    PromotionPage,
    StorePage,
    CatalogPage,
    ProductPage,
    ProductDetailPage,
    GiftConfirmPage,
    GiftRedeemPage,
  ],
  providers: [
    OfferService,
  ],
  exports: [
    OfferPostCmp,
    OfferListCmp,
    OfferGiftCmp,
    OfferPromoCmp,
  ],
})

export class OfferModule {
  constructor(
    public platform: Platform,
    public events: Events,
    public theApp: AppService,
    public userService: UserService,
    public modalCtrl: ModalController
  ) {
    // load translations
    //this.theApp.loadTranslations(UserTranslations);

    // subcribe events
    this.subscribeEvents();

    // platform ready
    this.platform.ready().then(() => {
      
    });
  }

  // Subscribe events
  subscribeEvents() {
    // subscribe app goto login
    this.events.subscribe('app:gotoLogin', (params) => {
      // this.theApp.utilityComp.presentModal(AuthenticatePage);
      /*let modal = this.modalCtrl.create(AuthenticatePage)
      modal.present();*/
      console.log('present login page');
    });
  }
}