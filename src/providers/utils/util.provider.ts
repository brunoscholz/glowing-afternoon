import { Injectable } from '@angular/core';
import { AlertController, Alert, LoadingController, Loading, ToastController, Toast } from 'ionic-angular';
import { Camera } from 'ionic-native';
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

  notifyError(error:any) {
    this.errorObserver.next(error);
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
      dismissOnPageChange: true,
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
}
