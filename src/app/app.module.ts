import { NgModule } from '@angular/core'; //ElementRef
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TimeAgoPipe, FromUnixPipe } from 'angular2-moment';
import moment from 'moment';

//import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

// Main generic Pages
import { WelcomePage } from '../pages/welcome/welcome';
import { HomeTabsPage } from '../pages/home-tabs/home-tabs';
import { HomePage } from '../pages/home/home';
import { SearchPage } from '../pages/search/search';

import { SignTabsPage } from '../pages/sign-tabs/sign-tabs';
import { SignInPage } from '../pages/sign-tabs/signin';
import { SignUpPage } from '../pages/sign-tabs/signup';
import { ForgotPage } from '../pages/sign-tabs/forgot';

import { SettingsPage } from '../pages/settings/settings';
import { FollowsPage } from '../pages/follows/follows';
import { FavoritesPage } from '../pages/favorites/favorites';
import { ReviewListPage } from '../pages/review-list/review-list';
import { BalancePage } from '../pages/balance/balance';
import { TourPage } from '../pages/tour/tour';

// support tabs
import { SellPage } from '../pages/sell/sell';
import { RegisterPage } from '../pages/sell/register';
import { SupportPage } from '../pages/sell/support';

// Company related Pages
import { CompanyPage } from '../pages/company/company';
import { CompanyDetailPage } from '../pages/company-detail/company-detail';
import { CatalogPage } from '../pages/catalog/catalog';

// Item related Pages
import { CategoryPage } from '../pages/category/category';
import { ProductPage } from '../pages/product/product';
import { ProductDetailPage } from '../pages/product-detail/product-detail';
import { ReviewPage } from '../pages/review/review';
import { ReviewDetailPage } from '../pages/review-detail/review-detail';

import { OfferPostCmp } from '../components/offer/offer';
import { UserProfileCmp } from '../components/user-profile/user';

// User related Pages
import { ProfilePage } from '../pages/profile/profile';
import { ProfileOptionsPage } from '../pages/profile/options';

// Pipes and Directives
import { ArrayFilterPipe } from '../pipes/array-filter';
import { OrderByPipe } from '../pipes/order-by';
import { ElasticHeader } from '../directives/elastic-header/elastic-header';

// Services and Providers
import { ConnectivityService } from '../providers/utils/connectivity.service';
import { AuthService } from '../providers/auth/auth.service';
import { DataService } from '../providers/data/data.service';
import { APIService } from '../providers/api/api.service';
import { APISettings } from '../providers/api/api-settings';
import { UtilProvider } from '../providers/utils/util.provider'
import { ErrorNotifierService } from '../providers/utils/error.notifier';

// Map related
// import { MapService } from '../providers/map/map.service';
// import { GeocoderService } from '../providers/map/geocoder.service';
// import { MapComponent } from '../components/map/map';
// import { MapPage } from '../pages/map/map';

/*const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'a00a135f'
  }
};
CloudModule.forRoot(cloudSettings)*/

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    TourPage,
    HomeTabsPage,
    HomePage,
    SignTabsPage,
    SignUpPage,
    SignInPage,
    ForgotPage,
    SearchPage,
    SettingsPage,
    FollowsPage,
    FavoritesPage,
    ReviewListPage,
    BalancePage,
    SellPage,
    RegisterPage,
    SupportPage,
    CompanyPage,
    CompanyDetailPage,
    CatalogPage,
    CategoryPage,
    ProductPage,
    ProductDetailPage,
    ReviewPage,
    ReviewDetailPage,
    ProfilePage,
    ProfileOptionsPage,
    ArrayFilterPipe,
    OrderByPipe,
    TimeAgoPipe,
    FromUnixPipe,
    ElasticHeader,
    OfferPostCmp,
    UserProfileCmp
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    TourPage,
    HomeTabsPage,
    HomePage,
    SignTabsPage,
    SignUpPage,
    SignInPage,
    ForgotPage,
    SearchPage,
    SettingsPage,
    FollowsPage,
    FavoritesPage,
    ReviewListPage,
    BalancePage,
    SellPage,
    RegisterPage,
    SupportPage,
    CompanyPage,
    CompanyDetailPage,
    CatalogPage,
    CategoryPage,
    ProductPage,
    ProductDetailPage,
    ReviewPage,
    ReviewDetailPage,
    ProfilePage,
    ProfileOptionsPage
  ],
  providers: [
    ErrorNotifierService,
    DataService,
    APIService,
    APISettings,
    ConnectivityService,
    AuthService,
    UtilProvider
  ]
})
export class AppModule {}
moment.locale('pt-br');
