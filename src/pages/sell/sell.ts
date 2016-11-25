import { Component } from '@angular/core';
import { SupportPage } from './support';
import { RegisterPage } from './register';

@Component({
  templateUrl: 'sell.html',
})
export class SellPage {

  tabsell1: any;
  tabsell2: any;

  constructor() {
    this.tabsell1 = SupportPage;
    this.tabsell2 = RegisterPage;
  }
}
