import { Component } from '@angular/core';
import { Nav, NavParams } from 'ionic-angular';

import { HomeTabsPage } from '../home-tabs/home-tabs';
import { SignTabsPage } from '../sign-tabs/sign-tabs';

@Component({
  templateUrl: 'tour.html',
})
export class TourPage {
  slides: any;
  logged: boolean = false;

  constructor(public navCtrl: Nav,
              navParams: NavParams
  ) {
    this.logged = navParams.get('logged');
    this.slides = [
      {
        title: "Bem Vindo ao Onde tem?!",
        description: "Ficamos alegres em poder ajudar você a realizar buscas mais eficientes no seu dia a dia e assim otimizar seu tempo.",
        image: "assets/img/splash/time.svg",
        class: 'first-intro-slide',
      },
      {
        title: "O que é o Onde tem?",
        description: "É uma plataforma que aproxima clientes e empresas, facilitando a comunicação e os negócios...",
        image: "assets/img/splash/chat.svg",
        class: 'second-intro-slide',
      },
      {
        title: "Como funciona?",
        description: "O cliente pode receber notificações sobre ofertas de produtos e serviços e encontrar as melhores ofertas sem sair de casa!",
        image: "assets/img/splash/favorite.svg",
        class: 'third-intro-slide',
      },
      {
        title: "Moedas",
        description: "Ao utilizar o app, você ganha moedas que podem ser trocadas por algumas ofertas das empresas participantes!",
        image: "assets/img/splash/coins.svg",
        class: 'forth-intro-slide',
      }
    ];
  }

  openPage(event) {
    this.navCtrl.setRoot((this.logged) ? HomeTabsPage : SignTabsPage);
  }

  skipTapped(event) {
    this.openPage(event);
  }
}
