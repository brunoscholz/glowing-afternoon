import { NgModule } from '@angular/core'; //ElementRef
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

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
import { TourPage } from '../pages/tour/tour';

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

// User related Pages
import { ProfilePage } from '../pages/profile/profile';
import { UserProfile } from '../pages/user-profile/user-profile';

// Pipes and Directives
import { ArrayFilterPipe } from '../pipes/array-filter';
import { OrderByPipe } from '../pipes/order-by';
import { ElasticHeader } from '../directives/elastic-header';
import { LoadingModal } from '../components/loading-modal/loading-modal';

// Services and Providers
//import { LoadingService } from '../providers/services/loading.service';
import { ConnectivityService } from '../providers/services/connectivity.service';
import { DataService } from '../providers/services/data.service';
import { APIService } from '../providers/services/api.service';
import { APISettings } from '../providers/api-settings';
import { ErrorNotifierService } from '../providers/services/error.notifier';

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
    CompanyPage,
    CompanyDetailPage,
    CatalogPage,
    CategoryPage,
    ProductPage,
    ProductDetailPage,
    ReviewPage,
    ReviewDetailPage,
    ProfilePage,
    UserProfile,
    LoadingModal,
    ArrayFilterPipe,
    OrderByPipe,
    ElasticHeader
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
    CompanyPage,
    CompanyDetailPage,
    CatalogPage,
    CategoryPage,
    ProductPage,
    ProductDetailPage,
    ReviewPage,
    ReviewDetailPage,
    ProfilePage,
    UserProfile,
    LoadingModal
  ],
  providers: [
    ErrorNotifierService,
    DataService,
    APIService,
    APISettings,
    ConnectivityService
  ]
})
export class AppModule {}
