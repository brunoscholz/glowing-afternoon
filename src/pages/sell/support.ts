import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

/*
	O objetivo desta página é, temporariamente, servir de apoio 
	de venda.

	Tira-se uma foto da loja e da logo
	Talvez adicionar alguns produtos
	E customizar para a empresa a ser visitada...

*/

@Component({
  templateUrl: 'support.html',
})
export class SupportPage {
	company: any = [];
	title: string;

	public base64CoverImage: string;
	public base64ThumbImage: string;

  constructor(private navCtrl: NavController,
              public dataService: DataService,
              private actionSheet: ActionSheetController,
              public util: UtilProvider) {
  	this.company = dataService.getVisitingCompany();
  	this.title = 'Apoio de Vendas';
  }

  presentPictureSource() {
    let promise = new Promise((res, rej) => {
      let ac = this.actionSheet.create({
        title: 'Select Picture Source',
        buttons: [
          { text: 'Camera', handler: () => { res(1); } },
          { text: 'Gallery', handler: () => { res(0); } },
          { text: 'Cancel', role: 'cancel', handler: () => { rej('cancel'); } }
        ]
      });
      ac.present();
    });
    return promise;
  }

  takePictureCover(){
    this.presentPictureSource()
    .then(source => {
      let sourceType:number = Number(source);
      return this.util.getPicture(sourceType);
    })
    .then(imageData => {
      //var blobImage = this.util.dataURItoBlob(imageData);
      //this.user.picture.thumbnail = imageData;
      
      // imageData is a base64 encoded string
      this.base64CoverImage = "data:image/jpeg;base64," + imageData;
      //return this.userProvider.uploadPicture(blobImage);
      let toast = this.util.getToast('Your Picture is updated');
      toast.present();
    });
    /*.then(imageURL => {
      return this.userProvider.updateProfile({avatar: imageURL});
    })*/
    /*.then(()=> {
    });*/
  }

  takePictureThumb(){
    this.presentPictureSource()
    .then(source => {
      let sourceType:number = Number(source);
      return this.util.getPicture(sourceType, true, {width:400, height:400});
    })
    .then(imageData => {
      //var blobImage = this.util.dataURItoBlob(imageData);
      //this.user.picture.thumbnail = imageData;
      
      // imageData is a base64 encoded string
      this.base64ThumbImage = "data:image/jpeg;base64," + imageData;
      //return this.userProvider.uploadPicture(blobImage);
      let toast = this.util.getToast('Your Picture is updated');
      toast.present();
    });
  }

  save() {
  	this.company.photoSrc = this.base64CoverImage;
  	this.company.thumbSrc = this.base64ThumbImage;
    this.dataService.setVisitingCompany(this.company);

    let toast = this.util.getToast('Informações Salvas');
    toast.onDidDismiss(() => {
      
    });

    toast.present();
  }

}
