import { Component, OnInit } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';

import { CategoryPage } from '../category/category';
import { ProductPage } from '../product/product';
import { DataService } from '../../providers/services/data.service';
import { LoadingService } from '../../providers/services/loading.service';
import { LoadingModal } from '../../components/loading-modal/loading-modal';

import { SearchPage } from '../search/search';

import { ViewStatusEnum } from '../../providers/enums';
import { ICategory } from '../../providers/interfaces';
import { ModelPage } from '../model-page';

// import { SpeechRecognition } from 'SpeechRecognition';

import _ from 'underscore';

declare var SpeechRecognition: any;
declare var platform: any;

@Component({
  templateUrl: './home.html'
  //selector: 'page-home',
  //providers: [LocationTracker]
})
export class HomePage extends ModelPage implements OnInit {
  formData: any = {q:''};
  recognition: any;
  ready: boolean = false;

  constructor(public navCtrl: NavController, navParams: NavParams, public dataService: DataService, public loading: LoadingService, platform: Platform) {
    super('OndeTem?!', dataService, loading);
    platform = platform;
    platform.ready().then(() => {
      console.log('platform ready...');
      this.ready = true;
    });
    this.doToggleLoading(false);
  }

  ngOnInit() {
    /*const searchSource = this.searchTermStream
      .debounceTime(1000)
      .distinctUntilChanged()
      .map(searchTerm => {
        this.terms = searchTerm
        return {search: searchTerm, page: 1}
      })*/
  }

  ionViewWillEnter() {
    this.doReset('OndeTem?!');
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

  SpeechToText() {
    if (this.ready) {
      this.recognition = new SpeechRecognition(); 
      this.recognition.lang = 'pt-BR'; //en-US
      
      this.recognition.onnomatch = (event => {
        console.log('No match found.');
      });
      
      this.recognition.onerror = (event => {
        console.log('Error happens.');
      });
      
      this.recognition.onresult = (event => {
        if (event.results.length > 0) {
          console.log('Output STT: ', event.results[0][0].transcript);            
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
