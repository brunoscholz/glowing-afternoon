import { Component } from '@angular/core';
import { SupportPage } from './support';
import { PreviewPage } from './preview';

@Component({
  templateUrl: 'sell.html',
})
export class SellPage {

  tabsell1: any;
  tabsell2: any;

  constructor() {
  	this.tabsell1 = PreviewPage;
    this.tabsell2 = SupportPage;
  }
}
