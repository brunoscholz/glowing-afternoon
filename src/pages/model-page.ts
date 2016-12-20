//import { Injectable, ReflectiveInjector } from '@angular/core';
import { DataService } from '../providers/data/data.service';
// import { AuthService } from '../providers/auth/auth.service';
import { UtilProvider } from '../providers/utils/util.provider';

import { ViewStatusEnum, DisplayModeEnum } from '../providers/utils/enums';
//import _ from 'underscore';

export class ModelPage {
  selectedItem: any;
  refresher: any;
  data: any;
  pageNum: number = 1;
  hasMore: boolean = false;
  color: string = '';

  
  title: string;
  viewStatus = ViewStatusEnum;
  status: any;
  
  displayMode = DisplayModeEnum;
  display: any;
  online: boolean = false;

  constructor(private ttl: string,
              public dataService: DataService,
              public util: UtilProvider
  ) {
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

  }

  /*doRefresh(refresher) {
    this.refresher = refresher;
  }*/

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
