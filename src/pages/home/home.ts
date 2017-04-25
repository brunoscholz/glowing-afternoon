import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SearchPage } from '../search/search';

import { AppService } from '../../modules/common/services/app.service';
import { DataService } from '../../modules/common/services/data.service';
import { SpeechService } from '../../modules/common/services/speech.service';

//import { ViewStatusEnum } from '../../providers/enums';
//import { IBuyer } from '../../providers/interfaces';
import { ModelPage } from '../../modules/common/pages/model-page';

@Component({
  selector: 'home-page',
  templateUrl: './home.html'
})
export class HomePage extends ModelPage {
  recognition: any;
  ready: boolean = false;
  recognizedText: string = "";
  formData: any = {q:''};
  randomCat: string = "ex.: encanador..";
  alert: any;

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public theApp: AppService,
    public dataService: DataService,
    public speech : SpeechService
  ) {
    super('Onde tem?');
    
    this.speech.onResultText(txt => {
      this.formData.q = txt;
      this.alert.dismiss();
    });
  }

  ionViewDidLoad() {
    this.doReset('Onde tem?');
    //this.online = this.checkNetwork();
  }

  ionViewWillEnter() {
    this.randomCat = this.dataService.randomProduct;
    this.formData.q = "";
  }

  changeViewState() {
    this.doToggleLoading(false);
  }

  doRefresh(refresher) {
    //this.refresher = refresher;
    //this.load();
  }

  load() {}

  presentAlert(msg: string) {
    this.alert = this.theApp.util.alertCtrl.create({
      title: "Busca",
      message: msg,
      buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          this.formData.q = "";
        }
      }
      /*{
        text: 'Buscar',
        handler: () => {
          this.onInput();
        }
      }*/
    ]
    });

    this.alert.onDidDismiss(() => {
      this.speech.stop();
    });

    this.alert.present();
  }

  toggleStartStop() {
    if(!this.speech.recognizing) {
      this.speech.start();
      this.presentAlert("Diga um nome, serviço ou produto para buscar");
    }
  }

  onInput() {
    if(this.formData.q == '')
      return;
    this.navCtrl.push(SearchPage, {term: this.formData.q});
  }

  onCancel() {}
}
