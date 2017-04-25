import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Subject } from 'rxjs/Rx';
import 'rxjs/Rx';

declare var Connection;

@Injectable()
export class ConnectivityService {
	onDevice: boolean;
	conn$: any;
	get connection$() { return this.conn$.asObservable(); }

  constructor(
    public platform: Platform,
    public network: Network
  ) {
    this.onDevice = this.platform.is('cordova');
		this.conn$ = new Subject();

		this.network.onDisconnect().subscribe(() => {
      console.log('Network was disconnected :-( ');
      this.conn$.next(false);
    });

    this.network.onConnect().subscribe(() => {
      console.log('Network is connected ;-) ');
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
        this.conn$.next(true);
      }, 3000);
    });
  }

  // testing puposes
  change(b) {
  	this.conn$.next(b);
  }

  isOnline(): boolean {
  	if(this.onDevice && this.network.type) {
      //unknown, ethernet, wifi, 2g, 3g, 4g, cellular, none
      return this.network.type !== 'none';
    } else {
      return navigator.onLine; 
    }
  }

  isOffline(): boolean {
  	if(this.onDevice && this.network.type){
      return this.network.type === 'none'; //Connection.NONE;
    } else {
      return !navigator.onLine;   
    }
  }
}