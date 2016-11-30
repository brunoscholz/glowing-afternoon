//import { Injectable, ReflectiveInjector } from '@angular/core';
import { DataService } from '../providers/data/data.service';
import { LoadingService } from '../providers/utils/loading.service';

// import { AuthService } from '../providers/auth/auth.service';
// import { UtilsService } from '../providers/utils/utils.service';

import { ViewStatusEnum, DisplayModeEnum } from '../providers/utils/enums';
//import _ from 'underscore';

export class ModelPage {
  selectedItem: any;
  refresher: any;
  data: any;
  
  title: string;
  viewStatus = ViewStatusEnum;
  status: any;
  
  displayMode = DisplayModeEnum;
  display: any;
  online: boolean = false;

  constructor(private ttl: string, public dataService: DataService, public loadingService: LoadingService) {
    //let injector = ReflectiveInjector.resolveAndCreate([LoadingService]);
    this.loadingService = loadingService;//injector.get(LoadingService);

    this.doReset(ttl);
    this.status = ViewStatusEnum.Loading;
    this.display = DisplayModeEnum.Card;
  }

  doChangeTitle(ttl: string) {
    this.title = ttl;
  }

  doReset(ttl: string) {
    this.title = ttl;
    this.data = [];
    this.status = ViewStatusEnum.Loading;
    this.doToggleLoading(true);
  }

  doToggleLoading(l: boolean) {
    this.loadingService.toggleLoadingIndicator(l);
  }

  /*doRefresh(refresher) {
    this.refresher = refresher;
  }*/

  doQuery(query) {
    this.dataService.findAll(query);
  }

  doChangeView(st: ViewStatusEnum) {
    this.status = st;
  }

  doChangeDisplayMode(mode: DisplayModeEnum) {
    this.display = mode;
  }

  /*addConnectivityListeners(){
 
    let onOnline = () => {
 
      setTimeout(() => {
        if(typeof google == "undefined" || typeof google.maps == "undefined"){
 
          this.loadGoogleMaps();
 
        } else {
 
          if(!this.mapInitialised){
            this.initMap();
          }
 
          this.enableMap();
        }
      }, 2000);
 
    };
 
    let onOffline = () => {
      this.disableMap();
    };
 
    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);
 
  }*/
}
