import { Component, OnInit } from '@angular/core';
import { Platform, NavController, NavParams, AlertController } from 'ionic-angular';

import { SearchPage } from '../search/search';

import { DataService } from '../../providers/services/data.service';
import { LoadingService } from '../../providers/services/loading.service';
import { ConnectivityService } from '../../providers/services/connectivity.service';

//import { ViewStatusEnum } from '../../providers/enums';
//import { IBuyer } from '../../providers/interfaces';
import { ModelPage } from '../model-page';

// import { SpeechRecognition } from 'SpeechRecognition';
//declare var SpeechRecognition: any;
declare var webkitSpeechRecognition: any;
declare var platform: any;

@Component({
  templateUrl: './home.html'
  //selector: 'page-home',
  //providers: [LocationTracker]
})
export class HomePage extends ModelPage implements OnInit {
  recognition: any;
  ready: boolean = false;
  recognizedText: string = "";
  formData: any = {q:''};

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public dataService: DataService,
    public loading: LoadingService,
    platform: Platform,
    private alertCtrl: AlertController,
    public connService: ConnectivityService
  ) {
    super('OndeTem?!', dataService, loading);
    platform = platform;
    platform.ready().then(() => {
      console.log('platform ready...');
      this.ready = true;
    });
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
    this.doReset('OndeTem?!');
    this.formData.q = "";
    this.online = this.checkNetwork();
  }

  checkNetwork() {
    return this.connService.isOnline();
  }

  changeViewState() {
    this.doToggleLoading(false);
  }

  doRefresh(refresher) {
    //this.refresher = refresher;
    //this.load();
  }

  load() {}

  presentAlert(input: string) {
    let alert = this.alertCtrl.create({
      title: input,
      buttons: ['ok']
    });

    alert.onDidDismiss(() => {
      //this.recognition.stop();
    });

    alert.present();
  }

  SpeechToText() {
    if (this.ready && this.online) {
      this.presentAlert('Busca por Voz');

      this.recognition = new webkitSpeechRecognition();

      this.recognition.lang = 'pt-BR'; //en-US
      
      this.recognition.onnomatch = (event => {
        console.log('No match found.');
      });
      
      this.recognition.onerror = (event => {
        console.log('Error happens.');
      });
      
      this.recognition.onresult = (event => {
        if (event.results.length > 0) {
          //this.recognizedText = event.results[0][0].transcript;
          this.formData.q = event.results[0][0].transcript;
          this.recognition.stop();
          //console.log('Output STT: ', this.formData.q);
        }
      });
      this.recognition.start();
    }
  }

  morethantworows(i) {
    return (i > 1) ? 'show-more-target' : '';
  }

  onInput() {
    if(this.formData.q == '')
      return;

    this.navCtrl.push(SearchPage, {term: this.formData.q});
  }

  onCancel() {}
}
