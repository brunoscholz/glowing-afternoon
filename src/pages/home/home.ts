import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { SearchPage } from '../search/search';

import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { SpeechService } from '../../providers/speech/speech.service';

//import { ViewStatusEnum } from '../../providers/enums';
//import { IBuyer } from '../../providers/interfaces';
import { ModelPage } from '../model-page';

// import { SpeechRecognition } from 'SpeechRecognition';
//declare var SpeechRecognition: any;
//declare var webkitSpeechRecognition: any;

@Component({
  selector: 'home-page',
  templateUrl: './home.html'
})
export class HomePage extends ModelPage {
  recognition: any;
  ready: boolean = false;
  recognizedText: string = "";
  formData: any = {q:''};
  alert: any;

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public dataService: DataService,
    public util: UtilProvider,
    public speech : SpeechService,
    private alertCtrl: AlertController
  ) {
    super('OndeTem?!', dataService, util);
    
    this.speech.onResultText(txt => {
      this.formData.q = txt;
      this.alert.dismiss();
    });
  }

  ionViewDidLoad() {
    this.doReset('OndeTem?!');
    //this.online = this.checkNetwork();
  }

  ionViewWillEnter() {
    this.formData.q = "";
  }

  /*checkNetwork() {
    return this.connService.isOnline();
  }*/

  changeViewState() {
    this.doToggleLoading(false);
  }

  doRefresh(refresher) {
    //this.refresher = refresher;
    //this.load();
  }

  load() {}

  presentAlert(msg: string) {
    this.alert = this.alertCtrl.create({
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
