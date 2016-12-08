import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { WhyPage } from './why';
import { ContactPage } from './contact';
import { PolicyPage } from './policy';
import { TermsPage } from './terms';
import { LicensePage } from './license';
import { IPage } from '../../providers/data/interfaces';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
	appPages: IPage[];
	legalPages: IPage[];

  constructor(public navCtrl: NavController) {
  	this.appPages = [
	    { title: 'Sobre a OndeTem?!', component: WhyPage, icon: 'home' },
	    { title: 'Contato', component: ContactPage, icon: 'grid' },
	  ];

		this.legalPages = [
			{ title: 'Privacidade', component: PolicyPage, icon: 'home' },
			{ title: 'Termos de Uso', component: TermsPage, icon: 'grid' },
			{ title: 'Licensas', component: LicensePage, icon: 'grid' },
		];
  }

  openPage(page: IPage) {
    this.navCtrl.push(page.component);
  }
}
