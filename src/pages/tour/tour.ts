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
        image: "assets/img/splash/house.svg",
        class: 'first-intro-slide',
      },
      {
        title: "O que é o OndeTem?",
        description: "Ionic Realty has the best brokers in the business. Open the menu and select <strong>Brokers</strong> to connect with our brokers in a whole new way!",
        image: "assets/img/splash/brokers.svg",
        class: 'second-intro-slide',
      },
      {
        title: "Como funciona?",
        description: "Keep track of your <strong>favorites</strong> and get notified when events happen: price reductions, open houses, etc.",
        image: "assets/img/splash/favorites.svg",
        class: 'third-intro-slide',
      },
      {
        title: "Moedas",
        description: "Keep track of your <strong>favorites</strong> and get notified when events happen: price reductions, open houses, etc.",
        image: "assets/img/splash/favorites.svg",
        class: 'forth-intro-slide',
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
