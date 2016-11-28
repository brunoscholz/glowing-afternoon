import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { DataService } from '../../providers/services/data.service';

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
export class RegisterPage {
	company: any = [];
	title: string;

  constructor(private navCtrl: NavController, public dataService: DataService, private toastCtrl: ToastController) {
  	this.company = dataService.getVisitingCompany();
  	this.title = 'Pré Cadastro';
  }

  save() {
    this.dataService.setVisitingCompany(this.company);
    this.dataService.addPreRegisterSeller();
  	/*this.company.photoSrc = this.base64CoverImage;
  	this.company.thumbSrc = this.base64ThumbImage;
    this.dataService.setVisitingCompany(this.company);
    let toast = this.toastCtrl.create({
      message: 'Informações Salvas',
      position: 'middle',
      showCloseButton: true,
      closeButtonText: "Ok"
    });

    toast.onDidDismiss(() => {
      
    });

    toast.present();*/
  }

}
