import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController} from 'ionic-angular';
import { Camera } from 'ionic-native';

@Injectable()
export class UtilProvider {
  constructor(public alertCtrl: AlertController, public loadCtrl: LoadingController, public toastCtrl: ToastController) {
  }

  doAlert(title, message, buttonText) {
      let alert = this.alertCtrl.create({
          title: title,
          subTitle: message,
          buttons: [buttonText]
      });
      return alert; 
  }
  
  presentLoading(content) {
    let loading = this.loadCtrl.create({
      dismissOnPageChange: true,
      content: content
    });
    return loading;
  }

  getToast(message) {
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
}

