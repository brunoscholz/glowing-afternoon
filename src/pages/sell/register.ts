import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, ActionSheetController } from 'ionic-angular';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

//import { ViewStatusEnum } from '../../providers/enums';

/*
	O objetivo desta página é, temporariamente, servir de apoio 
	de venda.

	Tira-se uma foto da loja e da logo
	Talvez adicionar alguns produtos
	E customizar para a empresa a ser visitada...

*/

@Component({
  templateUrl: 'register.html',
})
export class RegisterPage {
	company: any = [];
  sended: boolean = false;


  constructor(
    public viewCtrl: ViewController,
    private navCtrl: NavController,
    params: NavParams,
    public dataService: DataService,
    public actionSheet: ActionSheetController,
    public util: UtilProvider
  ) {
    this.company = params.data.company;
  }

  close(id, type) {
    this.viewCtrl.dismiss({ type: type, id: id });
  }

  updatePicture() {
    this.presentPictureSource()
    .then(source => {
      let sourceType:number = Number(source);
      return this.util.getPicture(sourceType);
    })
    .then(imageData => {
      //var blobImage = this.util.dataURItoBlob(imageData);
      //this.user.picture.thumbnail = imageData;
      console.log(imageData);
      //return this.userProvider.uploadPicture(blobImage);
      let toast = this.util.getToast('Your Picture is updated');
      toast.present();
    })
    .catch((ex) => {
      //console.log(ex);
    });
    /*.then(imageURL => {
      return this.userProvider.updateProfile({avatar: imageURL});
    })*/
    /*.then(()=> {
    });*/
  }

  updateAvatar() {}

  presentPictureSource() {
    let promise = new Promise((res, rej) => {
      let ac = this.actionSheet.create({
        title: 'Selecione a fonte da Imagem',
        buttons: [
          { text: 'Camera', handler: () => { res(1); } },
          { text: 'Galeria', handler: () => { res(0); } },
          { text: 'Cancelar', role: 'cancel', handler: () => { rej('cancel'); } }
        ]
      });
      ac.present();
    });
    return promise;
  }

  presentToast(msg) {
    let toast = this.util.getToast(msg);

    toast.onDidDismiss(() => {
      this.sended = false;
    });

    toast.present();
  }

  save() {
    if(this.sended)
      return;

    this.util.presentLoading('Registrando...')
    this.dataService.setVisitingCompany(this.company);
    this.dataService.addPreRegisterSeller()
      .then((data) => {
        this.sended = true;
        this.company = [];
        this.util.dismissLoading();
        this.presentToast('Pré cadastro efetuado');
      }, (err) => {
        this.presentToast(err);
      });
  }
  /*if(data.status == 200) {
    this.sended = true;
    this.company = [];
    this.presentToast('Pré cadastro efetuado');
  }
  else if(data.status == 401) {
    this.presentToast('Vendedor não autorizado!');
  }
  else if(data.status == 404) {
    this.presentToast('Email já cadastrado!');
  }
  else if(data.status == 500) {
    // send email to admin from server with the problems
    this.presentToast('Erro do servidor, tente mais tarde!');
  }*/
}
