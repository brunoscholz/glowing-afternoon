import { Component, ViewChild } from '@angular/core'; //, provide
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { ErrorNotifierService } from '../providers/services/error.notifier';

//import { SignTabsPage } from './pages/sign-tabs/sign-tabs';
import { WelcomePage } from '../pages/welcome/welcome';

import { HomeTabsPage } from '../pages/home-tabs/home-tabs';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { UserProfile } from '../pages/user-profile/user-profile';
import { SearchPage } from '../pages/search/search';
import { CategoryPage } from '../pages/category/category';
import { CompanyPage } from '../pages/company/company';
import { SettingsPage } from '../pages/settings/settings';


import { LoadingService } from '../providers/services/loading.service';
import { LoadingModal } from '../components/loading-modal/loading-modal';

@Component({
  templateUrl: 'app.html',
  providers: [
      LoadingService,
      LoadingModal
    ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = HomeTabsPage;
  pages: Array<{ title: string, component: any, root: boolean }>;
  error: any;

  constructor(public platform: Platform, public menu: MenuController, private errorNotifier:ErrorNotifierService) {
    this.initializeApp();

      this.errorNotifier.onError(err => {
        this.error = err;
        console.log(err);
      });

      // set our app's pages
      this.pages = [
        { title: 'Home', component: HomeTabsPage, root: true },
        { title: 'Empresas', component: CompanyPage, root: false },
        
        //{ title: 'Visita', component: VisitPage }
        { title: 'Configuração', component: SettingsPage, root: false }
        //{ title: 'Logout', component: SignTabsPage }
      ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    if(page.root)
      this.nav.setRoot(page.component);
    else
      this.nav.push(page.component);
  }

  logout() {
    this.nav.setRoot(WelcomePage);
  }
}
