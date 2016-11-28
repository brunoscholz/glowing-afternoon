import { Component, ViewChild } from '@angular/core'; //, provide
import { Platform, MenuController, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { ErrorNotifierService } from '../providers/services/error.notifier';

// import { SignTabsPage } from './pages/sign-tabs/sign-tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import { SignTabsPage } from '../pages/sign-tabs/sign-tabs';

import { HomeTabsPage } from '../pages/home-tabs/home-tabs';
//import { CompanyPage } from '../pages/company/company';
import { SettingsPage } from '../pages/settings/settings';
import { SellPage } from '../pages/sell/sell';

import { DataService } from '../providers/services/data.service';
import { AuthService } from '../providers/services/auth.service';
import { LoadingService } from '../providers/services/loading.service';
import { LoadingModal } from '../components/loading-modal/loading-modal';
import { ConnectivityService } from '../providers/services/connectivity.service';

//import _ from 'underscore';

@Component({
  templateUrl: 'app.html',
  providers: [
    AuthService,
    DataService,
    ConnectivityService,
    LoadingService,
    LoadingModal
  ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  //rootPage: any = HomeTabsPage;
  rootPage: any = WelcomePage;
  pages: Array<{ title: string, component: any, root: boolean }>;
  error: any;
  loggedUser: any;

  constructor(public platform: Platform, public menu: MenuController, public alertCtrl: AlertController, private errorNotifier:ErrorNotifierService, public dataService: DataService, public auth: AuthService, public connService: ConnectivityService) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Home', component: HomeTabsPage, root: true },
      //{ title: 'Empresas', component: CompanyPage, root: false },
      { title: 'Configurações', component: SettingsPage, root: false }
    ];

    this.dataService.loggedUser$
    .distinctUntilChanged()
    .subscribe((user) => {
      this.loggedUser = user;
      this.setUser();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.checkConnection();
      this.errorNotifier.onError(err => {
        this.error = err;
        console.log(err);
      });
      this.authenticate();
    });
  }

  authenticate() {
    this.auth.loadUserCredentials().then((res) => {
      // this.auth.isLoggedin
      if(res) {
        this.dataService.fetchUser({});
        setTimeout(() => {
          this.nav.setRoot(HomeTabsPage);
        }, 2000);
      }
      else {
        setTimeout(() => {
          this.nav.setRoot(SignTabsPage);
        }, 2000);
      }
    });
  }

  setUser() {
    if(this.loggedUser.user.role === 'salesman' || this.loggedUser.user.role === 'administrator')
    {
      this.pages.push({ title: 'Vendas', component: SellPage, root: false });
    }
    this.pages.push({ title: 'Logout', component: 'logout', root: false });
  }

  checkConnection() {
    this.connService.connection$
      .subscribe((status) => {
        console.log(status);
        if(status) {

        }
        else {
          let alert = this.alertCtrl.create({
            title: "Connection",
            message: "You are offline!"
          });
          alert.present();
        }
      });
    if(!this.connService.isOnline()) {}
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();

    if(page.component === 'logout') {
      this.logout();
      return;
    }

    // navigate to the new page if it is not the current page
    if(page.root)
      this.nav.setRoot(page.component);
    else
      this.nav.push(page.component);
  }

  logout() {
    this.auth.logout();
    this.nav.setRoot(SignTabsPage);
  }
}
