import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'home-tabs.html',
})
export class HomeTabsPage {
	
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;

  constructor(public nav: NavController) {
  	this.tab1Root = HomePage;
    this.tab2Root = ProfilePage;
    this.tab3Root = ContactPage;
  }

  openScan() {
    // navigate to the new page if it is not the current page
    //this.nav.setRoot(ScanPage);
    //this.nav.push(ScanPage);
  }
}
