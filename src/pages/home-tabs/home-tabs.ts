import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { CategoryPage } from '../category/category';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'home-tabs.html',
})
export class HomeTabsPage {
	
  tab1Root: any = HomePage;
  tab2Root: any = CategoryPage;
  tab3Root: any = ProfilePage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
