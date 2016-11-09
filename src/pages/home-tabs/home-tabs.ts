import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CategoryPage } from '../category/category';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'home-tabs.html',
})
export class HomeTabsPage {
	
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;

  constructor(public nav: NavController) {
  	this.tab1Root = HomePage;
    this.tab2Root = CategoryPage;
    this.tab3Root = ProfilePage;
  }

  openScan() {
    // navigate to the new page if it is not the current page
    //this.nav.setRoot(ScanPage);
    //this.nav.push(ScanPage);
  }
}
