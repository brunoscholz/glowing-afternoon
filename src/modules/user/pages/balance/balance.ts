import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppService } from '../../../common/services/app.service';
import { UserService } from '../../services/user.service';

import { ViewStatusEnum } from '../../../common/models/enums';
import { IUser, ITransaction, IBalance } from '../../../common/models/interfaces';
import { ModelPage } from '../../../common/pages/model-page';

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

  constructor(
    public navCtrl: NavController,
		public userService: UserService,
		public theApp: AppService
	) {
  	super('Saldos');
  }

  ionViewDidLoad() {
    this.loadAll();
  }

  loadAll() {
    let self = this;
    this.theApp.util.presentLoading('Carregando Saldos!');
    this.load()
    .then((res) => {
      self.changeViewState(true);
      if(self.refresher)
        self.refresher.complete();
    }, (err) => {
      self.theApp.util.dismissLoading();
      self.theApp.notifyError(err);
    });
  }

  load() {
    let self = this;
    self.doChangeView(ViewStatusEnum.Loading);

    let promise = new Promise((resolve, reject) => {
      self.theApp.authService.getUser()
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
      self.userService.getBalance({
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

  changeViewState(b: boolean) {
    this.doChangeViewState(b);
    this.theApp.util.dismissLoading();
  }
}
