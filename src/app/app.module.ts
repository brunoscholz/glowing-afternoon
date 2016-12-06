import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

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

// sale support tabs & pages
import { SellPage } from '../pages/sell/sell';
import { RegisterPage } from '../pages/sell/register';
import { SupportPage } from '../pages/sell/support';
import { PreviewPage } from '../pages/sell/preview';

// Company related Pages
import { CompanyPage } from '../pages/company/company';
import { CompanyDetailPage } from '../pages/company-detail/company-detail';
import { CatalogPage } from '../pages/catalog/catalog';

// Item related Pages
import { ProductPage } from '../pages/product/product';
import { ProductDetailPage } from '../pages/product-detail/product-detail';
import { ReviewPage } from '../pages/review/review';
import { ReviewDetailPage } from '../pages/review-detail/review-detail';

// directives
import { OfferPostCmp } from '../components/offer/offer';
import { UserProfileCmp } from '../components/user-profile/user';
import { UserCardCmp } from '../components/user-card/user';
import { ControlMessages } from '../components/control-messages/control-messages';

// Pipes and Directives
import { ArrayFilterPipe } from '../pipes/array-filter';
import { TimeAgoPipe } from '../pipes/time-ago';
import { OrderByPipe } from '../pipes/order-by';
import { ElasticHeader } from '../directives/elastic-header/elastic-header';

// Services and Providers
import { ConnectivityService } from '../providers/utils/connectivity.service';
import { AuthService } from '../providers/auth/auth.service';
import { DataService } from '../providers/data/data.service';
import { APIService } from '../providers/api/api.service';
import { APISettings } from '../providers/api/api-settings';
import { UtilProvider } from '../providers/utils/util.provider';
//import { ValidationService } from '../validators/validators';
import { ErrorNotifierService } from '../providers/utils/error.notifier';

// Map related
// import { MapService } from '../providers/map/map.service';
// import { GeocoderService } from '../providers/map/geocoder.service';
// import { MapComponent } from '../components/map/map';
// import { MapPage } from '../pages/map/map';

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
    SellPage,
    RegisterPage,
    SupportPage,
    PreviewPage,
    CompanyPage,
    CompanyDetailPage,
    CatalogPage,
    ProductPage,
    ProductDetailPage,
    ReviewPage,
    ReviewDetailPage,
    OfferPostCmp,
    UserProfileCmp,
    UserCardCmp,
    ControlMessages,
    ArrayFilterPipe,
    OrderByPipe,
    TimeAgoPipe,
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
    SellPage,
    RegisterPage,
    SupportPage,
    PreviewPage,
    CompanyPage,
    CompanyDetailPage,
    CatalogPage,
    ProductPage,
    ProductDetailPage,
    ReviewPage,
    ReviewDetailPage
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