import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

@Component({
  templateUrl: 'support.html',
})
export class SupportPage {
	company: any = [];
	title: string;

  constructor(private navCtrl: NavController,
              public dataService: DataService,
              private actionSheet: ActionSheetController,
              public util: UtilProvider) {
  	this.company = dataService.getVisitingCompany();
  	this.title = 'Apoio de Vendas';
  }

  save() {
    this.dataService.setVisitingCompany(this.company);

    let toast = this.util.getToast('Informações Salvas');
    toast.onDidDismiss(() => {
      
    });

    toast.present();
  }

}
