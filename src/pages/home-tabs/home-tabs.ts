import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { CategoryPage } from '../../modules/offer/pages/category/category';
import { PromotionPage } from '../../modules/offer/pages/promotion/promotion';
import { StorePage } from '../../modules/offer/pages/store/store';

@Component({
  templateUrl: 'home-tabs.html',
})
export class HomeTabsPage {
	
  tab1Root: any = HomePage;
  tab2Root: any = CategoryPage;
  /*tab3Root: any = PromotionPage;*/
  tab4Root: any = StorePage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
