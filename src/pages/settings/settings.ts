import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MockDataService } from '../../providers/services/mockdata.service';

import {Camera} from 'ionic-native';

/*
	O objetivo desta página é, temporariamente, servir de apoio 
	de venda.

	Tira-se uma foto da loja e da logo
	Talvez adicionar alguns produtos
	E customizar para a empresa a ser visitada...

*/

@Component({
  templateUrl: 'settings.html',
})
export class SettingsPage {
	company: any = [];
	title: string;

	public base64CoverImage: string;
	public base64ThumbImage: string;

  constructor(private navCtrl: NavController, public dataService: MockDataService) {
  	this.company = dataService.getVisitingCompany();
  	this.title = 'Configurações';
  }

  takePictureCover(){
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 592,
      targetHeight: 396
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64CoverImage = "data:image/jpeg;base64," + imageData;
    }, (err) => {
        console.log(err);
    });
  }

  takePictureThumb(){
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 400,
      targetHeight: 400
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64ThumbImage = "data:image/jpeg;base64," + imageData;
    }, (err) => {
        console.log(err);
    });
  }

  save() {
  	this.company.photoSrc = this.base64CoverImage;
  	this.company.thumbScr = this.base64ThumbImage;
    this.dataService.setVisitingCompany(this.company);
  }

}
