import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { ModelPage } from '../model-page';
//import { ViewStatusEnum } from '../../providers/enums';

/*
	O objetivo desta página é, temporariamente, servir de apoio 
	de venda.

	Tira-se uma foto da loja e da logo
	Talvez adicionar alguns produtos
	E customizar para a empresa a ser visitada...

*/

@Component({
  templateUrl: 'register.html',
})
export class RegisterPage extends ModelPage implements OnInit {
	company: any = [];
  sended: boolean = false;

  constructor(
    private navCtrl: NavController,
    public dataService: DataService,
    public util: UtilProvider
  ) {
    super('Pré Cadastro', dataService, util);
    this.company = dataService.getVisitingCompany();

    this.doToggleLoading(false);
  }

  ngOnInit() {
    /*this.dataService.loggedUser$
    .subscribe((user) => {
      this.loggedUser = user;
      //this.setUser();
    });

    this.dataService.getLoggedUser();*/
  }

  ionViewWillEnter() {
    //this.doReset('OndeTem?!');
    //this.load();
  }

  changeViewState() {
    this.doToggleLoading(false);
  }

  doRefresh(refresher) {
    //this.refresher = refresher;
    //this.load();
  }

  load() {}

  /*presentAlert(input: string) {
    let alert = this.alertCtrl.create({
      title: input,
      buttons: ['ok']
    });

    alert.onDidDismiss(() => {
      //this.recognition.stop();
    });

    alert.present();
  }*/

  presentToast(msg) {
    let toast = this.util.getToast(msg);

    toast.onDidDismiss(() => {
      this.doToggleLoading(false);
      this.sended = false;
    });

    toast.present();
  }

  save() {
    if(this.sended)
      return;

    this.doToggleLoading(true);
    this.dataService.setVisitingCompany(this.company);
    this.dataService.addPreRegisterSeller()
      .subscribe(data => {
        console.log(data);
        if(data.status == 200) {
          this.sended = true;
          this.company = [];
          this.presentToast('Pré cadastro efetuado');
        }
        else if(data.status == 401) {
          this.presentToast('Vendedor não autorizado!');
        }
        else if(data.status == 404) {
          this.presentToast('Email já cadastrado!');
        }
        else if(data.status == 500) {
          // send email to admin from server with the problems
          this.presentToast('Erro do servidor, tente mais tarde!');
        }
      });
  }

}
