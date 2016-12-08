import { Component, ViewChild } from '@angular/core'; //, provide
import { Platform, MenuController, Nav } from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';

import { WelcomePage } from '../pages/welcome/welcome';
import { SignTabsPage } from '../pages/sign-tabs/sign-tabs';

import { HomeTabsPage } from '../pages/home-tabs/home-tabs';
import { SellPage } from '../pages/sell/sell';
import { TourPage } from '../pages/tour/tour';

import { IPage } from '../providers/data/interfaces';

import { DataService } from '../providers/data/data.service';
import { AuthService } from '../providers/auth/auth.service';
import { UtilProvider } from '../providers/utils/util.provider';
import { ConnectivityService } from '../providers/utils/connectivity.service';

import { IUser } from '../providers/data/interfaces';

@Component({
  templateUrl: 'app.html',
  providers: [
    AuthService,
    DataService,
    ConnectivityService,
    UtilProvider
  ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = WelcomePage;
  error: any;
  isSalesPerson: boolean = false;
  loading: any;
  isLoading: boolean = false;
  loggedUser: string = 'none';

  appPages: IPage[] = [
    { title: 'Início', component: HomeTabsPage, icon: 'home' },
    { title: 'Categorias', component: HomeTabsPage, index: 1, icon: 'grid' },
  ];

  loggedInPages: IPage[] = [
    { title: 'Perfil', component: HomeTabsPage, index: 2, icon: 'person' },
    { title: 'Sair', component: SignTabsPage, icon: 'log-out', logsOut: true }
  ];
  //{ title: 'Configurações', component: SettingsPage, icon: 'settings', passRoot: true },

  loggedOutPages: IPage[] = [
    { title: 'Entrar', component: SignTabsPage, icon: 'log-in' },
    { title: 'Cadastrar', component: SignTabsPage, index:1, icon: 'person-add' }
  ];

  constructor(public platform: Platform,
              public menu: MenuController,
              public dataService: DataService,
              public auth: AuthService,
              public util: UtilProvider,
              public connService: ConnectivityService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
      this.checkConnection();
      this.loadIndicator();
      this.util.onError(err => {
        //this.error = err;
        let alert = this.util.doAlert('Erro!', err, 'Ok');
        alert.present();
      });
    });

    this.getUser();
    this.authenticate();
  }

  authenticate() {
    this.auth.loadUserCredentials().then((user: IUser) => {
    }, (err) => {
      console.log(err);
    });
  }

  getUser() { 
    let self = this;
    this.auth.loggedIn$
    .subscribe((usr) => {
      let logged = false;
      let changed = false;
      let first = false;
      if(usr) {
        self.isSalesPerson = (usr.role === 'salesman' || usr.role === 'administrator');
        logged = true;
        first = usr['firstLogin'];

        if(usr.userId !== self.loggedUser || self.loggedUser == 'none') {
          self.loggedUser = usr.userId;
          changed = true;
        }
      }
      else {
        self.isSalesPerson = false;
        changed = true;
      }
      
      self.enableMenu(logged);
      if(changed && !first)
        self.gotoMainPage(logged);
    });
  }

  gotoMainPage(logged) {
    if(logged) {
        setTimeout(() => {
          this.nav.setRoot(HomeTabsPage);
        }, 2000);
      }
      else {
        setTimeout(() => {
          this.nav.setRoot(SignTabsPage);
        }, 2000);
      }
  }

  checkConnection() {
    this.connService.connection$
      .subscribe((status) => {
        console.log(status);
        if(status) {

        }
        else {
          let alert = this.util.doAlert("Connection", "You are offline!", 'OK');
          alert.present();
        }
      });
    if(!this.connService.isOnline()) {}
  }

  loadIndicator() {
    this.util.load$
    .subscribe((result) => {
      if(result) {
        if(this.isLoading)
          return;
        this.loading = this.util.getLoading(result);
        this.loading.present();
        this.isLoading = true;
      }
      else {
        this.loading.dismiss();
        this.isLoading = false;
      }
    });
  }

  openPage(page: IPage) {
    // close the menu when clicking a link from the menu
    this.menu.close();

    if(page.index) {
      this.nav.setRoot(page.component, { tabIndex: page.index });
    } else {
      if(page.passRoot)
        this.nav.push(page.component);
      else
        this.nav.setRoot(page.component);
    }

    if(page.logsOut === true) {
      setTimeout(() => {
        this.logout();
      }, 1000);
    }
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  openTutorial() {
    this.nav.setRoot(TourPage);
  }

  openSales() {
    this.nav.setRoot(SellPage);
  }

  logout() {
    this.auth.logout();
    this.enableMenu(false);
    //this.nav.setRoot(SignTabsPage);
  }
}
