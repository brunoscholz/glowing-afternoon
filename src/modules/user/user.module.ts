import { NgModule } from '@angular/core';
import { Platform, Events, ModalController } from 'ionic-angular';
import { CommonModule } from '../common/common.module';
import { MapsModule } from '../maps/maps.module';

import { AppService } from '../common/services/app.service';
import { UserService } from './services/user.service';

/*import { GKAboutPage } from './pages/gk-about';
import { GKGuidePage } from './pages/gk-guide';
import { GKFeedbackPage } from './pages/gk-feedback';
import { GKDebugPage } from './pages/gk-debug';*/


// Sign related pages
/*import { AuthenticatePage } from './pages/authenticate';*/
import { SignTabsPage } from './pages/sign-tabs/sign-tabs';
import { SignInPage } from './pages/sign-tabs/signin';
import { SignUpPage } from './pages/sign-tabs/signup';
import { ForgotPage } from './pages/sign-tabs/forgot';

/*import { MePage } from './pages/me';
import { MeProfilePage } from './pages/me-profile';
import { MeProfileUpdatePage } from './pages/me-profileUpdate';
import { MeSettingPage } from './pages/me-setting';*/

// User related Pages
import { ProfilePage } from './pages/profile/profile';
import { SettingsPage } from './pages/settings/settings';
import { BalancePage } from './pages/balance/balance';
import { UserDetailPage } from './pages/user-detail/user-detail';

import { UserProfileCmp } from './components/user-profile/user';
import { UserCardCmp } from './components/user-card/user';
import { ProfileModalPage } from './components/user-profile/modal';

//import { SetAddressModal } from './pages/sell/address';

// Company related Pages
//import { CompanyPage } from './pages/company/company';
import { CompanyDetailPage } from './pages/company-detail/company-detail';
import { SellerMapPage } from './pages/company-detail/map-page';

import { SellerCardCmp } from './components/seller-card/seller';
import { SellerProfileCmp } from './components/seller-profile/seller';

@NgModule({
  imports: [
    CommonModule,
    MapsModule,
  ],
  declarations: [
    SignTabsPage,
    SignInPage,
    SignUpPage,
    ForgotPage,
    ProfilePage,
    SettingsPage,
    BalancePage,
    UserDetailPage,
    CompanyDetailPage,
    SellerMapPage,
    UserProfileCmp,
    UserCardCmp,
    ProfileModalPage,
    SellerCardCmp,
    SellerProfileCmp,
  ],
  entryComponents: [
    SignTabsPage,
    SignInPage,
    SignUpPage,
    ForgotPage,
    ProfilePage,
    SettingsPage,
    BalancePage,
    UserDetailPage,
    CompanyDetailPage,
    SellerMapPage,
  ],
  providers: [
    UserService,
  ],
  exports: [
    UserProfileCmp,
    UserCardCmp,
    ProfileModalPage,
    SellerCardCmp,
    SellerProfileCmp,
  ],
})

export class UserModule {
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
      // get user
      this.getUser();
    });
  }

  // get user
  getUser() {
    /*setTimeout(() => {
      this.userService.getUser().then((userInfo) => {
        this.events.publish('auth:logIn', userInfo);
      }, () => {
        this.events.publish('auth:logOut');
      });
    }, 5000);*/
    this.events.publish('auth:logOut');
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