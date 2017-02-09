import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { AppErrorHandler } from '../providers/error.handler';

// Main generic Pages
import { WelcomePage } from '../pages/welcome/welcome';
import { HomeTabsPage } from '../pages/home-tabs/home-tabs';
import { HomePage } from '../pages/home/home';
import { CategoryPage } from '../pages/category/category';
import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';
import { TourPage } from '../pages/tour/tour';

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

// sale support tabs & pages
import { SellPage } from '../pages/sell/sell';
import { RegisterPage } from '../pages/sell/register';
import { SupportPage } from '../pages/sell/support';
import { PreviewPage } from '../pages/sell/preview';
import { SetAddressModal } from '../pages/sell/address';

// Company related Pages
import { CompanyPage } from '../pages/company/company';
import { CompanyDetailPage } from '../pages/company-detail/company-detail';
import { CompanyOptionsPage } from '../pages/company-detail/company-options';
import { CatalogPage } from '../pages/catalog/catalog';
import { SellerMapPage } from '../pages/company-detail/map-page';

// Item related Pages
import { ProductPage } from '../pages/product/product';
import { ProductDetailPage } from '../pages/product-detail/product-detail';
import { ProductOptionsPage } from '../pages/product-detail/product-options';
import { ReviewPage } from '../pages/review/review';
import { ReviewDetailPage } from '../pages/review-detail/review-detail';

import { AboutPage } from '../pages/about/about';
import { WhyPage } from '../pages/about/why';
import { ContactPage } from '../pages/about/contact';
import { PolicyPage } from '../pages/about/policy';
import { TermsPage } from '../pages/about/terms';
import { LicencePage } from '../pages/about/licence';

// directives
import { EmptyListCmp } from '../components/empty/empty';
import { OfferPostCmp } from '../components/offer/offer';
import { UserProfileCmp } from '../components/user-profile/user';
import { UserCardCmp } from '../components/user-card/user';
import { SellerCardCmp } from '../components/seller-card/seller';
import { TransactionCmp } from '../components/transaction/transaction';
import { ControlMessages } from '../components/control-messages/control-messages';

// Pipes and Directives
import { ArrayFilterPipe } from '../pipes/array-filter';
import { TimeAgoPipe } from '../pipes/time-ago';
import { OrderByPipe } from '../pipes/order-by';
import { TxFilterPipe } from '../pipes/tx-filter';
import { CounterPipe } from '../pipes/counter';
import { MoneyPipe } from '../pipes/money';
import { ElasticHeader } from '../directives/elastic-header/elastic-header';

// Services and Providers
import { ConnectivityService } from '../providers/utils/connectivity.service';
import { AuthService } from '../providers/auth/auth.service';
import { DataService } from '../providers/data/data.service';
import { APIService } from '../providers/api/api.service';
import { APISettings } from '../providers/api/api-settings';
import { UtilProvider } from '../providers/utils/util.provider';
import { SpeechService } from '../providers/speech/speech.service';
//import { ValidationService } from '../validators/validators';

// Map related
import { MapService } from '../providers/map/map.service';
import { GeocoderService } from '../providers/map/geocoder.service';
import { MapCmp } from '../components/map/map';
import { MapPage } from '../pages/map/map';
import { MapSearch } from '../components/map-search/map-search';

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
    SellPage,
    RegisterPage,
    SupportPage,
    PreviewPage,
    SetAddressModal,
    CompanyPage,
    CompanyDetailPage,
    CompanyOptionsPage,
    SellerMapPage,
    CatalogPage,
    ProductPage,
    ProductDetailPage,
    ProductOptionsPage,
    ReviewPage,
    ReviewDetailPage,
    EmptyListCmp,
    OfferPostCmp,
    TransactionCmp,
    UserProfileCmp,
    UserCardCmp,
    SellerCardCmp,
    ControlMessages,
    AboutPage,
    WhyPage,
    ContactPage,
    PolicyPage,
    TermsPage,
    LicencePage,
    MapPage,
    MapCmp,
    MapSearch,
    ArrayFilterPipe,
    OrderByPipe,
    TxFilterPipe,
    TimeAgoPipe,
    CounterPipe,
    MoneyPipe,
    ElasticHeader
  ],
  imports: [
    IonicModule.forRoot(MyApp)
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
    SellPage,
    RegisterPage,
    SupportPage,
    PreviewPage,
    SetAddressModal,
    CompanyPage,
    CompanyDetailPage,
    CompanyOptionsPage,
    SellerMapPage,
    CatalogPage,
    ProductPage,
    ProductDetailPage,
    ProductOptionsPage,
    ReviewPage,
    ReviewDetailPage,
    AboutPage,
    WhyPage,
    ContactPage,
    PolicyPage,
    TermsPage,
    LicencePage,
    MapPage,
    MapSearch,
  ],
  providers: [
    {provide: ErrorHandler, useClass: AppErrorHandler},
    DataService,
    APIService,
    APISettings,
    ConnectivityService,
    AuthService,
    UtilProvider,
    SpeechService,
    MapService,
    GeocoderService
  ]
})
export class AppModule {}