import { Component, ViewChild } from '@angular/core'; //, provide
import { Platform, MenuController, Nav, AlertController } from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';


import { WelcomePage } from '../pages/welcome/welcome';
import { SignTabsPage } from '../pages/sign-tabs/sign-tabs';

import { HomeTabsPage } from '../pages/home-tabs/home-tabs';
import { SettingsPage } from '../pages/settings/settings';
import { SellPage } from '../pages/sell/sell';

import { IPage } from '../providers/data/interfaces';

import { ErrorNotifierService } from '../providers/utils/error.notifier';
import { DataService } from '../providers/data/data.service';
import { AuthService } from '../providers/auth/auth.service';
import { LoadingService } from '../providers/utils/loading.service';
import { ConnectivityService } from '../providers/utils/connectivity.service';
import { LoadingModal } from '../components/loading-modal/loading-modal';

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

  rootPage: any = WelcomePage;
  error: any;
  isSalesPerson: boolean = false;

  appPages: IPage[] = [
    { title: 'Início', component: HomeTabsPage, icon: 'home' },
    { title: 'Categorias', component: HomeTabsPage, index: 1, icon: 'grid' },
  ];

  loggedInPages: IPage[] = [
    { title: 'Perfil', component: HomeTabsPage, index: 2, icon: 'profile' },
    { title: 'Configurações', component: SettingsPage, icon: 'cog', passRoot: true },
    { title: 'Sair', component: SignTabsPage, icon: 'log-out', logsOut: true }
  ];

  loggedOutPages: IPage[] = [
    { title: 'Entrar', component: SignTabsPage, icon: 'log-in' },
    { title: 'Cadastrar', component: SignTabsPage, index:1, icon: 'person-add' }
  ];

  constructor(public platform: Platform, public menu: MenuController, public alertCtrl: AlertController, private errorNotifier:ErrorNotifierService, public dataService: DataService, public auth: AuthService, public connService: ConnectivityService) {
    this.initializeApp();

    this.dataService.loggedUser$
    .distinctUntilChanged()
    .subscribe((buyer) => {
      this.isSalesPerson = (buyer.user.role === 'salesman' || buyer.user.role === 'administrator');
      this.enableMenu(this.auth.isLoggedin === true);
      this.gotoMainPage(this.auth.isLoggedin === true);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
      this.checkConnection();
      this.errorNotifier.onError(err => {
        this.error = err;
        console.log(err);
      });
    });
    
    this.authenticate();
  }

  authenticate() {
    this.auth.loadUserCredentials().then((res) => {
      if(res) {
        this.dataService.fetchUser(res);
      } else {
        this.gotoMainPage(false);
      }
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

  /*setUser(user) {
    if(!user)

    if(user.role === 'salesman' || this.loggedUser.user.role === 'administrator')
    {
      //this.pages.push({ title: 'Vendas', component: SellPage, root: false });
      this.isSalesPerson = true;
    }
    this.pages.push({ title: 'Logout', component: 'logout', root: false });
  }*/

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
    //this.nav.setRoot(TourPage);
  }

  openSales() {
    this.nav.setRoot(SellPage);
  }

  logout() {
    this.auth.logout();
    this.enableMenu(false);
    this.nav.setRoot(SignTabsPage);
  }
}
