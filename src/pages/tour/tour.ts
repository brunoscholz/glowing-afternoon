import { Component } from '@angular/core';
import { Nav } from 'ionic-angular';

import { HomeTabsPage } from '../home-tabs/home-tabs';

@Component({
  templateUrl: 'tour.html',
})
export class TourPage {
  slides: any;

  constructor(public navCtrl: Nav) {
    this.slides = [
      {
        title: "Bem Vindo ao OndeTem?!",
        description: "Your dream house is one tap away! Open the menu and select <strong>Properties</strong> to start your search.",
        image: "img/splash/house.svg",
      },
      {
        title: "O que é o OndeTem?",
        description: "Ionic Realty has the best brokers in the business. Open the menu and select <strong>Brokers</strong> to connect with our brokers in a whole new way!",
        image: "img/splash/brokers.svg",
      },
      {
        title: "Como funciona?",
        description: "Keep track of your <strong>favorites</strong> and get notified when events happen: price reductions, open houses, etc.",
        image: "img/splash/favorites.svg",
      },
      {
        title: "Moedas",
        description: "Keep track of your <strong>favorites</strong> and get notified when events happen: price reductions, open houses, etc.",
        image: "img/splash/favorites.svg",
      }
    ];
  }

  openPage(event) {
    this.navCtrl.setRoot(HomeTabsPage);
  }

  skipTapped(event) {
    this.openPage(HomeTabsPage);
  }
}
