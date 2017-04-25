import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';

import { AppErrorHandler } from '../providers/error.handler';

import { CommonModule } from '../modules/common/common.module';
//import { UserModule } from '../modules/user/user.module';
import { MapsModule } from '../modules/maps/maps.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { InAppBrowser } from  "@ionic-native/in-app-browser";

// Main generic Pages
import { WelcomePage } from '../pages/welcome/welcome';
import { HomeTabsPage } from '../pages/home-tabs/home-tabs';
import { HomePage } from '../pages/home/home';
import { CategoryPage } from '../pages/category/category';
import { SearchPage } from '../pages/search/search';
import { TourPage } from '../pages/tour/tour';
import { PromotionPage } from '../pages/promotion/promotion';
import { StorePage } from '../pages/store/store';

import { GiftConfirmPage } from '../pages/gift/gift-confirm';
import { GiftRedeemPage } from '../pages/gift/gift-redeem';

import { ProfilePage } from '../pages/profile/profile';

// Sign related pages
import { SignTabsPage } from '../pages/sign-tabs/sign-tabs';
import { SignInPage } from '../pages/sign-tabs/signin';
import { SignUpPage } from '../pages/sign-tabs/signup';
import { ForgotPage } from '../pages/sign-tabs/forgot';

// User related Pages
import { ProfileOptionsPage } from '../pages/profile/options';
import { SettingsPage } from '../pages/settings/settings';
import { FollowsPage } from '../pages/follows/follows';
import { FavoritesPage } from '../pages/favorites/favorites';
import { ReviewListPage } from '../pages/review-list/review-list';
import { BalancePage } from '../pages/balance/balance';
import { UserDetailPage } from '../pages/user-detail/user-detail';
import { UserOptionsPage } from '../pages/user-detail/user-options';

import { UserProfileCmp } from '../components/user-profile/user';
import { ProfileModalPage } from '../components/user-profile/modal';

//import { SetAddressModal } from '../pages/sell/address';

// Company related Pages
import { CompanyPage } from '../pages/company/company';
import { CompanyDetailPage } from '../pages/company-detail/company-detail';
import { CompanyOptionsPage } from '../pages/company-detail/company-options';
import { CatalogPage } from '../pages/catalog/catalog';
import { SellerMapPage } from '../pages/company-detail/map-page';

import { SellerProfileCmp } from '../components/seller-profile/seller';
//import { ProfileModalPage } from '../components/user-profile/modal';

// Item related Pages
import { ProductPage } from '../pages/product/product';
import { ProductDetailPage } from '../pages/product-detail/product-detail';
import { ReviewPage } from '../pages/review/review';
import { ReviewCompanyPage } from '../pages/review/review-company';
import { ReviewDetailPage } from '../pages/review-detail/review-detail';

import { AboutPage } from '../pages/about/about';
import { WhyPage } from '../pages/about/why';
import { ContactPage } from '../pages/about/contact';
import { PolicyPage } from '../pages/about/policy';
import { TermsPage } from '../pages/about/terms';
import { LicencePage } from '../pages/about/licence';

// directives
import { RatingCmp } from '../components/star-rating/rating';
import { EmptyListCmp } from '../components/empty/empty';
import { OfferPostCmp } from '../components/offer/offer';
import { OfferListCmp } from '../components/offer-list/offer';
import { OfferGiftCmp } from '../components/offer-gift/offer';
import { OfferPromoCmp } from '../components/offer-promo/offer';

import { FollowCardCmp } from '../components/follow-card/card';
import { ReviewCardCmp } from '../components/review-card/card';
import { UserCardCmp } from '../components/user-card/user';
import { SellerCardCmp } from '../components/seller-card/seller';
import { TransactionCmp } from '../components/transaction/transaction';
import { ControlMessages } from '../components/control-messages/control-messages';

//import { ElasticHeader } from '../directives/elastic-header/elastic-header';

// Services and Providers

//import { ValidationService } from '../validators/validators';

// Map related

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    HomeTabsPage,
    HomePage,
    CategoryPage,
    ProfilePage,
    SearchPage,
    TourPage,
    StorePage,
    GiftConfirmPage,
    GiftRedeemPage,
    PromotionPage,
    SignTabsPage,
    SignInPage,
    SignUpPage,
    ForgotPage,
    ProfileOptionsPage,
    SettingsPage,
    FollowsPage,
    FavoritesPage,
    ReviewListPage,
    BalancePage,
    UserDetailPage,
    UserOptionsPage,
    CompanyPage,
    CompanyDetailPage,
    CompanyOptionsPage,
    SellerMapPage,
    CatalogPage,
    ProductPage,
    ProductDetailPage,
    ReviewPage,
    ReviewCompanyPage,
    ProfileModalPage,
    ReviewDetailPage,
    RatingCmp,
    EmptyListCmp,
    OfferPostCmp,
    OfferListCmp,
    OfferGiftCmp,
    OfferPromoCmp,
    TransactionCmp,
    UserProfileCmp,
    SellerProfileCmp,
    FollowCardCmp,
    ReviewCardCmp,
    UserCardCmp,
    SellerCardCmp,
    ControlMessages,
    AboutPage,
    WhyPage,
    ContactPage,
    PolicyPage,
    TermsPage,
    LicencePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CommonModule,
    MapsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    HomeTabsPage,
    HomePage,
    CategoryPage,
    ProfilePage,
    SearchPage,
    TourPage,
    StorePage,
    GiftConfirmPage,
    GiftRedeemPage,
    PromotionPage,
    SignTabsPage,
    SignInPage,
    SignUpPage,
    ForgotPage,
    ProfileOptionsPage,
    SettingsPage,
    FollowsPage,
    FavoritesPage,
    ReviewListPage,
    BalancePage,
    UserDetailPage,
    UserOptionsPage,
    CompanyPage,
    CompanyDetailPage,
    CompanyOptionsPage,
    SellerMapPage,
    CatalogPage,
    ProductPage,
    ProductDetailPage,
    ReviewPage,
    ReviewCompanyPage,
    ProfileModalPage,
    ReviewDetailPage,
    AboutPage,
    WhyPage,
    ContactPage,
    PolicyPage,
    TermsPage,
    LicencePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
        provide: ErrorHandler, useClass: AppErrorHandler
    },
  ]
})
export class AppModule {}