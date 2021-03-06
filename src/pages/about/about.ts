import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { WhyPage } from './why';
import { ContactPage } from './contact';
import { PolicyPage } from './policy';
import { TermsPage } from './terms';
import { LicencePage } from './licence';

import { IPage } from '../../modules/common/models/interfaces';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
	appPages: IPage[];
	legalPages: IPage[];

  constructor(public navCtrl: NavController) {
  	this.appPages = [
	    { title: 'Sobre o Onde tem?', component: WhyPage, icon: 'home' },
	    { title: 'Contato', component: ContactPage, icon: 'grid' },
	  ];

		this.legalPages = [
			{ title: 'Políticas de Privacidade', component: PolicyPage, icon: 'home' },
			{ title: 'Para Usuários', component: TermsPage, icon: 'grid' },
			{ title: 'Para Clientes', component: LicencePage, icon: 'grid' },
		];
  }

  openPage(page: IPage) {
    this.navCtrl.push(page.component);
  }
}
