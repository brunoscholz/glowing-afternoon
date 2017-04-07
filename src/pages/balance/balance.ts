import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { IUser, ITransaction, IBalance } from '../../providers/data/interfaces';
import { ViewStatusEnum } from '../../providers/utils/enums';
import { ModelPage } from '../model-page';

@Component({
  selector: 'page-balance',
  templateUrl: 'balance.html'
})
export class BalancePage extends ModelPage {
  user: IUser;
  balance: IBalance;
  tx: ITransaction[] = [];
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
    this.loadAll();
  }

  loadAll() {
    let self = this;
    this.util.presentLoading('Carregando Saldos!');
    this.load()
    .then((res) => {
      self.changeViewState();
      if(self.refresher)
        self.refresher.complete();
    }, (err) => {
      self.util.dismissLoading();
      self.util.notifyError(err);
    });
  }

  load() {
    let self = this;
    self.doChangeView(ViewStatusEnum.Loading);

    let promise = new Promise((resolve, reject) => {
      self.auth.getUserInfo()
      .then((usr: IUser) => {
        if(usr) {
          self.user = usr;
          return self.loadBalance(usr);
        }
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
    });
    return promise;
  }

  loadBalance (usr: IUser) {
    var self = this;
    let promise = new Promise((resolve, reject) => {
      // get balance
      self.dataService.getBalance({
        controller: 'transaction',
        query: { 'userId': { test: "like binary", value: usr.userId } },
        asset: 'coin'
      }).then((bal) => {
        self.tx = <ITransaction[]>bal['transactions'];
        self.balance = <IBalance>bal['balance'];
        resolve(true);
      }, (err) => {
        reject(err);
      });
    });
    return promise;
  }

  changeViewState() {
    if(this.balance)
      this.doChangeView(ViewStatusEnum.Full);
    else
      this.doChangeView(ViewStatusEnum.Empty);
    this.util.dismissLoading();
  }
}
