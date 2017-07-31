import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { AppService } from '../../../common/services/app.service';
//import { UserService } from '../../services/user.service';
import { OfferService } from '../../../offer/services/offer.service';

//import { GiftConfirmPage } from '../../../offer/pages/gift/gift-confirm';

import { ViewStatusEnum } from '../../../common/models/enums';
import { IProfile, IVoucherFact } from '../../../common/models/interfaces';
import { ModelPage } from '../../../common/pages/model-page';

@Component({
  selector: 'page-voucher',
  templateUrl: 'voucher.html'
})
export class VoucherPage extends ModelPage {
  profile: IProfile;
  vouchers: IVoucherFact[];

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public alertCtrl: AlertController,
		public offerService: OfferService,
		public theApp: AppService
	) {
  	super('Cupons');
    this.profile = navParams.get('profile');
  }

  ionViewDidLoad() {
    this.load();
  }

  load() {
    var self = this;
    this.doChangeView(ViewStatusEnum.Loading);
    this.theApp.util.presentLoading('Buscando...');

    let query = {};
    
    if(this.profile.type == 'buyer')
      query = { 'buyerId': this.profile.id };
    // error on else

    self.offerService.getMyVouchers(query)
    .then((cupons: any[]) => {
      self.vouchers = <IVoucherFact[]>cupons;
      //console.log(self.vouchers);
      this.changeViewState(true);
    }, (err) => {
      console.log(err);
    });
  }

  changeViewState(b: boolean) {
    this.doChangeViewState(b);
    this.theApp.util.dismissLoading();
  }

  onConsume(voucher):void {
    if(voucher) {
      //confirma uso do voucher... manda para o seller, 'debita' o usuário, espera confimação
      /*let modal = this.modCtrl.create(GiftConfirmPage, { voucher: voucher });
      modal.onDidDismiss(ret => {});
      modal.present();*/
      let self = this;
      let confirm = this.alertCtrl.create({
        title: 'Consumir o Cupom?',
        message: 'Usar o cupom de ' + (voucher.discount) + '% de desconto?',
        buttons: [
          {
            text: 'Não',
            handler: () => {
              //console.log('Disagree clicked');
            }
          },
          {
            text: 'Sim',
            handler: () => {
              self.confirmConsume(voucher);
            }
          }
        ]
      });
      confirm.present();
    }
  }

  confirmConsume(voucher: IVoucherFact) {
    let self = this;
    self.theApp.util.presentLoading('Aguarde..');

    let body = {
      VoucherModel: {
        offerId: voucher.offer.offerId,
        voucherFactId: voucher.voucherFactId
      }
    };

    self.offerService.consumeVoucher({
      data: body
    })
    .then((data) => {
      if(data['status'] == 200) {
        self.theApp.util.presentToast('O cupom foi trocado com sucesso!');
        self.theApp.util.dismissLoading();
      }
    }, (err) => {
      console.log(err);
      self.theApp.notifyError(err);
      self.theApp.util.dismissLoading();
    });
  }
}
