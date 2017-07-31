import { Injectable } from '@angular/core';
//import { MenuController } from 'ionic-angular';


@Injectable()
export class MenuService {
  menuTitle: string = 'Menu'
  currentPageId: number;
  menuPages;

  /*appPages: IPage[] = [
    { title: 'Busca', component: HomeTabsPage, icon: 'home' },
    { title: 'Produtos', component: HomeTabsPage, index: 1, icon: 'grid' },
    { title: 'Promoções', component: HomeTabsPage, index: 2, icon: 'cut' },
    { title: 'Loja', component: HomeTabsPage, index: 3, icon: 'cart' },
  ];

  loggedInPages: IPage[] = [
    { title: 'Perfil', component: ProfilePage, icon: 'person' },
    { title: 'Sair', component: SignTabsPage, icon: 'log-out', logsOut: true }
  ];
  //{ title: 'Configurações', component: SettingsPage, icon: 'settings', passRoot: true },

  loggedOutPages: IPage[] = [
    { title: 'Início', component: SignTabsPage, icon: 'home' },
    { title: 'Entrar', component: SignInPage, icon: 'log-in', passRoot: true },
    { title: 'Cadastrar', component: SignUpPage, icon: 'person-add', passRoot: true }
  ];*/

  constructor(
  ) {
  }

  /*loggedIn() {}*/
}
