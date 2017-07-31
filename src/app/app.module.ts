import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';

import { AppErrorHandler } from '../providers/error.handler';

import { CommonModule } from '../modules/common/common.module';
import { UserModule } from '../modules/user/user.module';
import { MapsModule } from '../modules/maps/maps.module';
import { SocialModule } from '../modules/social/social.module';
import { OfferModule } from '../modules/offer/offer.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from  "@ionic-native/in-app-browser";

// Main generic Pages
import { WelcomePage } from '../pages/welcome/welcome';
import { HomeTabsPage } from '../pages/home-tabs/home-tabs';
import { HomePage } from '../pages/home/home';

import { SearchPage } from '../pages/search/search';

import { AboutPage } from '../pages/about/about';
import { WhyPage } from '../pages/about/why';
import { ContactPage } from '../pages/about/contact';
import { PolicyPage } from '../pages/about/policy';
import { TermsPage } from '../pages/about/terms';
import { LicencePage } from '../pages/about/licence';
import { TourPage } from '../pages/tour/tour';

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    HomeTabsPage,
    HomePage,
    SearchPage,
    TourPage,
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
    UserModule,
    MapsModule,
    SocialModule,
    OfferModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    HomeTabsPage,
    HomePage,
    SearchPage,
    TourPage,
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
    InAppBrowser,
    {
      provide: ErrorHandler, useClass: AppErrorHandler
    },
  ]
})
export class AppModule {}