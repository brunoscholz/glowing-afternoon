import { Injectable } from '@angular/core';
//import { Platform } from 'ionic-angular';

import { Camera } from 'ionic-native';

import { AuthService } from './auth.service';
import { APISettings } from '../models/api.settings';


@Injectable()
export class Helper {
  private baseUrl: string;

  constructor(
    public authService: AuthService
  ) {
    this.baseUrl = APISettings.WEBURL + APISettings.APIVERSION + "/";
  }

  // get api
  getAPI(uri): string {
    /*let apiDomain = (window as any).API_DOMAIN;

    if (apiDomain && apiDomain.substring(0, 4) == 'http') {
      return apiDomain + '/api/' + uri;
    } else {
      return (<any> window).location.href + 'api/' + uri;
    }*/
    return this.baseUrl + uri;
  }

  // get asset url
  getAssetUri(uri): string {
    return 'assets/' + uri;
  }

  // get video
  getVideo(uri): string {
    return this.getAssetUri('video/'+uri);
  }

  // get img
  getImg(uri): string {
    return this.getAssetUri('img/'+uri);
  }

  // get parameter by name
  getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  // set Title
  setTitle(title?) {
    /*if (title) {
      document.title = title;
      /*this.translateService.get(title).subscribe((res: string) => {
      });
    }

    let i = document.createElement('iframe');
    i.src = '//m.baidu.com/favicon.ico';
    i.style.display = 'none';
    i.onload = function() {
      setTimeout(function(){
        i.remove();
      }, 9)
    }

    document.body.appendChild(i);*/
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
      Camera.getPicture(options)
      .then((imageData) => {
        base64Picture = "data:image/jpeg;base64," + imageData;
        resolve(base64Picture);
      }, (error) => {
        reject(error);
      });
    });
    return promise;
  }
}
