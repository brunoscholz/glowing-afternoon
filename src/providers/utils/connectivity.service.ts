import { Injectable } from '@angular/core';
import { Network } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { Subject } from 'rxjs/Rx';
import 'rxjs/Rx';

declare var Connection;

@Injectable()
export class ConnectivityService {
	onDevice: boolean;
	conn$: any;
	get connection$() { return this.conn$.asObservable(); }

  constructor(public platform: Platform) {
    this.onDevice = this.platform.is('cordova');
		this.conn$ = new Subject();

		Network.onDisconnect().subscribe(() => {
      console.log('Network was disconnected :-( ');
      this.conn$.next(false);
    });

    Network.onConnect().subscribe(() => {
      console.log('Network is connected ;-) ');
      if (Network.connection === 'wifi') {
        console.log('we got a wifi connection, woohoo!');
      }
      this.conn$.next(true);
    });
  }

  // testing puposes
  change(b) {
  	this.conn$.next(b);
  }

  isOnline(): boolean {
  	if(this.onDevice && Network.connection){
      return Network.connection !== Connection.NONE;
    } else {
      return navigator.onLine; 
    }
  }

  isOffline(): boolean {
  	if(this.onDevice && Network.connection){
      return Network.connection === Connection.NONE;
    } else {
      return !navigator.onLine;   
    }
  }
}