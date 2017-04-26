import { NgModule } from '@angular/core';
import { Platform, Events, ModalController } from 'ionic-angular';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';

import { AppService } from '../common/services/app.service';
import { UserService } from '../user/services/user.service';
import { SocialService } from './services/social.service';

import { ReviewPage } from './pages/review/review';
import { ReviewCompanyPage } from './pages/review/review-company';
import { ReviewDetailPage } from './pages/review-detail/review-detail';
import { ReviewListPage } from './pages/review-list/review-list';

import { FollowsPage } from './pages/follows/follows';
import { FavoritesPage } from './pages/favorites/favorites';

import { ReviewCardCmp } from './components/review-card/card';
import { FollowCardCmp } from './components/follow-card/card';

@NgModule({
  imports: [
    CommonModule,
    UserModule,
  ],
  declarations: [
    ReviewPage,
    ReviewCompanyPage,
    ReviewDetailPage,
    ReviewListPage,
    FollowsPage,
    FavoritesPage,
    ReviewCardCmp,
    FollowCardCmp,
  ],
  entryComponents: [
    ReviewPage,
    ReviewCompanyPage,
    ReviewDetailPage,
    ReviewListPage,
    FollowsPage,
    FavoritesPage,
  ],
  providers: [
    SocialService,
  ],
  exports: [
    ReviewCardCmp,
    FollowCardCmp,
  ],
})

export class SocialModule {
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
    
  }
}