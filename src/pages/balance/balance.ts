import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { IUser, ILoyalty, IBalance } from '../../providers/data/interfaces';
import { ViewStatusEnum } from '../../providers/utils/enums';
import { ModelPage } from '../model-page';

@Component({
  selector: 'page-balance',
  templateUrl: 'balance.html'
})
export class BalancePage extends ModelPage {
  user: IUser;
  balance: IBalance;
  tx: ILoyalty[] = [];
  txtabs:string = 'alltx';
  tk: string = 'all';

  constructor(public navCtrl: NavController,
							public dataService: DataService,
							public auth: AuthService,
							public util: UtilProvider
	) {
  	super('Saldos', dataService, util);
  }

  ionViewDidLoad() {
    this.load();
  }

  load() {
    let self = this;
    this.doChangeView(ViewStatusEnum.Loading);
  	this.auth.checkAuthentication()
    .then((usr: IUser) => {
      if(usr) {
        self.user = usr;
        self.loadBalance();
      }
    }, (err) => {
      console.log(err);
    });
  }

  loadBalance() {
  	let self = this;
    this.util.presentLoading('Carregando saldos!');
  	self.dataService.getBalance({
      controller: 'loyalty',
      query: { 'userId': { test: "like binary", value: self.user.userId } }
    }).then((loyal: any) => {
      self.tx = <ILoyalty[]>loyal['loyalties'];
      self.balance = <IBalance>loyal['balance'];
      self.changeViewState();
    });
  }

  changeViewState() {
    if(this.balance)
      this.doChangeView(ViewStatusEnum.Full);
    else
      this.doChangeView(ViewStatusEnum.Empty);
    this.util.dismissLoading();
  }
}
