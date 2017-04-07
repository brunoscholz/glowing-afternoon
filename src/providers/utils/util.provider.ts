import { Injectable } from '@angular/core';
import { AlertController, Alert, LoadingController, Loading, ToastController, Toast } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { ISeller } from '../data/interfaces';
import { Subject, Observable, Observer, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/Rx';

@Injectable()
export class UtilProvider {
  load$: any;
  private errorObservable:Observable<any>;
  private errorObserver:Observer<any>;
  get loading$() { return this.load$.asObservable(); }

  private theme: BehaviorSubject<string>;
  availableThemes: {className: string, prettyName: string}[];

  constructor(public alertCtrl: AlertController, public loadCtrl: LoadingController, public toastCtrl: ToastController) {
    this.load$ = new Subject();
    this.theme = new BehaviorSubject('light-theme');
    this.errorObservable = Observable.create((observer:Observer<any>) => {
      this.errorObserver = observer;
    }).share();

    this.availableThemes = [
      {className: 'light-theme', prettyName: 'Branco'},
      {className: 'night-theme', prettyName: 'Verde'}
    ];
  }

  notifyError(error:Error) {
    this.errorObserver.next(error.message);
  }

  onError(callback:(err:any) => void) {
    this.errorObservable.subscribe(callback);
  }

  doAlert(title, message, buttonText): Alert {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [buttonText]
    });
    return alert;
  }
  
  getLoading(content): Loading {
    let loading = this.loadCtrl.create({
      content: content
    });
    return loading;
  }

  presentLoading(content) {
    this.load$.next(content);
  }

  dismissLoading() {
    this.load$.next(false);
  }

  getToast(message): Toast {
    let toast = this.toastCtrl.create({
      message: message,
      duration:2000
    });
    return toast;
  }

  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab], {type: mimeString});
    return bb;
  }

  // Get Picture
  getPicture(sourceType = 0, allowEdit = true, size = { width: 592, height: 396 }) {
    let base64Picture;
    let options = {
      destinationType:0,
      sourceType: sourceType,
      encodingType:0 ,
      mediaType:0,
      targetWidth: size.width,
      targetHeight: size.height,
      allowEdit: allowEdit
    };
    
    let promise = new Promise((resolve, reject) => {
      Camera.getPicture(options).then((imageData) => {
        base64Picture = "data:image/jpeg;base64," + imageData;
        resolve(base64Picture);
      }, (error) => {
        reject(error);
      });
    });
    return promise;
  }

  setTheme(val) {
    this.theme.next(val);
  }

  getTheme() {
    return this.theme.asObservable();
  }

  applyHaversineSeller(locations: Array<ISeller>, usersLocation) {
    locations.map((location) => {
      let placeLocation = {
        lat: location.billingAddress.latitude,
        lng: location.billingAddress.longitude
      };

      location.distance = this.getDistanceBetweenPoints(
        usersLocation,
        placeLocation,
        'km'
      );
    });

    return locations;
  }

  applyHaversine(locations, usersLocation = {lat: -25.4289541, lng: -49.267137}) {
 
    locations.map((location) => {
      let placeLocation = {
        lat: location.latitude,
        lng: location.longitude
      };

      location.distance = this.getDistanceBetweenPoints(
        usersLocation,
        placeLocation,
        'km'
      ).toFixed(2);
    });
 
        return locations;
    }
 
    getDistanceBetweenPoints(start, end, units): number {
      let earthRadius = {
        miles: 3958.8,
        km: 6371
      };

      let R = earthRadius[units || 'miles'];
      let lat1 = start.lat;
      let lon1 = start.lng;
      let lat2 = end.lat;
      let lon2 = end.lng;

      let dLat = this.toRad((lat2 - lat1));
      let dLon = this.toRad((lon2 - lon1));
      let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;

      return d;
    }

    toRad(x){
      return x * Math.PI / 180;
    }
}
