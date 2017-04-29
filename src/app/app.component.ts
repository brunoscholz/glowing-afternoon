import { Component, ViewChild } from '@angular/core'; //, provide
import { Platform, MenuController, Nav, Events } from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';

import { WelcomePage } from '../pages/welcome/welcome';
import { ProfilePage } from '../modules/user/pages/profile/profile';
import { HomeTabsPage } from '../pages/home-tabs/home-tabs';

import { TourPage } from '../pages/tour/tour';
import { AboutPage } from '../pages/about/about';

import { AppService } from '../modules/common/services/app.service';
import { SpeechService } from '../modules/common/services/speech.service';
import { MapService } from '../modules/maps/services/map.service';

import { IUser, IPage } from '../modules/common/models/interfaces';

/*providers: [
  AuthService,
  UtilProvider,
  SpeechService
]*/
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = WelcomePage;
  error: any;
  loading: any;
  isLoading: boolean = false;
  loggedUser: string = 'none';
  chosenTheme: string = 'night-theme';
  user: IUser;

  appPages: IPage[] = [
    { title: 'Busca', component: HomeTabsPage, icon: 'home' },
    { title: 'Produtos', component: HomeTabsPage, index: 1, icon: 'grid' },
    { title: 'Promoções', component: HomeTabsPage, index: 2, icon: 'cut' },
    { title: 'Loja', component: HomeTabsPage, index: 3, icon: 'cart' },
  ];

  loggedInPages: IPage[] = [
    { title: 'Perfil', component: ProfilePage, icon: 'person' },
    { title: 'Sair', component: '', icon: 'log-out', logsOut: true }
  ];
  //{ title: 'Configurações', component: SettingsPage, icon: 'settings', passRoot: true },

  loggedOutPages: IPage[] = [
    { title: 'Início', component: 'SignTabsPage', icon: 'home' },
    { title: 'Entrar', component: 'SignInPage', icon: 'log-in', passRoot: true },
    { title: 'Cadastrar', component: 'SignUpPage', icon: 'person-add', passRoot: true }
  ];

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public theApp: AppService,
    public speech: SpeechService,
    public mapService: MapService,
    public events: Events
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      this.hideSplashScreen();

      //this.loadIndicator();
      this.theApp.onError(err => {
        //this.error = err;
        let alert = this.theApp.util.doAlert('Erro!', err, 'Ok');
        alert.present();
      });
      this.speech.init();
    });

    this.theApp.getTheme()
      .subscribe((val) => {
        this.chosenTheme = val;
      });

    //this.getUser();
    //this.authenticate();
    this.subscribeEvents();
  }

  subscribeEvents() {
    // subscribe auth loggedIn
    this.events.subscribe('auth:loggedIn', () => {
      this.enableMenu(true);
      this.nav.setRoot(HomeTabsPage);
    });

    // subscribe auth loggedOut
    this.events.subscribe('auth:loggedOut', () => {
      this.enableMenu(true);
    });
  }

  authenticate() {
    let self = this;
    self.theApp.authService.getUser()
    .then((res: IUser) => {
      console.log("Already authorized");
      setTimeout(() => {
        // dismiss loading
        self.prepareUser(res);
        this.nav.setRoot(HomeTabsPage);
      });
    }, (err) => {
      console.log("Not already authorized");
      setTimeout(() => {
        // dismiss loading
        //this.nav.setRoot(SignTabsPage);
      });
    });
  }

  /*getUser() { 
    let self = this;
    self.auth.loggedIn$
    .subscribe((usr) => {
      self.prepareUser(usr);
    });
  }*/

  prepareUser(usr) {
    let logged = false;

    if(usr) {
      logged = true;
    }
    
    this.enableMenu(logged);
  }

  /*checkConnection() {
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
  }*/

  loadIndicator() {
    /*this.util.load$
    .subscribe((result) => {
      if(result) {
        if(this.isLoading)
          return;
        this.loading = this.util.getLoading(result);
        this.loading.present();
        this.isLoading = true;
      }
      else {
        if(this.loading)
          this.loading.dismiss();
        this.isLoading = false;
      }
    });*/
  }

  hideSplashScreen() {
    if (Splashscreen) {
      setTimeout(() => {
        Splashscreen.hide();
      }, 100);
    }
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
      this.logout();
    }
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  openTutorial(isLogged) {
    this.nav.setRoot(TourPage, { logged: isLogged});
  }

  openAbout() {
    this.nav.push(AboutPage);
  }

  logout() {
    setTimeout(() => {
      //this.auth.logout();
      this.enableMenu(false);
      //this.nav.setRoot(SignTabsPage);
    }, 1000);
  }
}
