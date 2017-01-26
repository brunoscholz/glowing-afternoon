import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, ActionSheetController } from 'ionic-angular';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { IUser } from '../../providers/data/interfaces';
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
      this.company.picture.cover = imageData; //"data:image/jpeg;base64," + 
      this.viewCtrl.dismiss('cover', this.company.picture.cover);
      let toast = this.util.getToast('A foto de capa foi atualizada...');
      toast.present();
    })
    .catch((ex) => {
      console.log(ex);
    });
    /*.then(imageURL => {
      return this.userProvider.updateProfile({avatar: imageURL});
    })*/
    /*.then(()=> {
    });*/
  }

  updateAvatar() {
    this.presentPictureSource()
    .then(source => {
      let sourceType:number = Number(source);
      return this.util.getPicture(sourceType, true, { width: 256, height: 256 });
    })
    .then((imageData) => {
      //var blobImage = this.util.dataURItoBlob(imageData);
      //return this.userProvider.uploadPicture(blobImage);
      this.company.picture.thumbnail = imageData; //"data:image/jpeg;base64," + 
      this.viewCtrl.dismiss('thumb', this.company.picture.thumbnail);
      let toast = this.util.getToast('O avatar foi atualizado...');
      toast.present();
    })
    .catch((ex) => {
      console.log(ex);
    });
  }

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

    this.dataService.getUser()
    .then((usr: IUser) => {
      let seller = {
        Seller: {
          name: this.company.name,
          about: this.company.about,
          email: this.company.email,
          website: this.company.website,
          phone: this.company.phone,
          cellphone: this.company.cellphone,
          hours: this.company.hours,
          status: "PAY",
          license: this.company.license
        },
        BillingAddress: {
          address: this.company.billingAddress.address,
          city: this.company.billingAddress.city,
          neighborhood: "",
          state: "PR",
          postCode: "",
          country: "Brasil (BRA)"
        },
        Picture: {
          cover: this.company.picture.cover,
          thumbnail: this.company.picture.thumbnail
        },
        salesman: usr.userId
      }

      this.dataService.addPreRegisterSeller(seller)
      .then((data) => {
        this.sended = true;
        this.company = [];
        this.dataService.setVisitingCompany(this.company);
        this.util.dismissLoading();
        this.presentToast('Pré cadastro efetuado');
        this.viewCtrl.dismiss();
      }, (err) => {
        this.presentToast(err);
        this.viewCtrl.dismiss();
      });
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
