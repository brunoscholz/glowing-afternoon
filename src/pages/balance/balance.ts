import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { IUser, ILoyalty, IBalance } from '../../providers/data/interfaces';
import { ModelPage } from '../model-page';

@Component({
  selector: 'page-balance',
  templateUrl: 'balance.html'
})
export class BalancePage extends ModelPage implements OnInit {
	user: IUser;
	balance: IBalance;
	tx: ILoyalty[];

  constructor(public navCtrl: NavController,
							public dataService: DataService,
							public auth: AuthService,
							public util: UtilProvider
	) {
  	super('Saldos', dataService, util);
  }

  ngOnInit() {
  	var self = this;

    self.dataService.balance$.subscribe((loyal: any) => {
      self.tx = <ILoyalty[]>loyal['loyalties'];
      self.balance = <IBalance>loyal['balance'];
      console.log(this.balance);
      console.log(this.tx)
    });
  }

  ionViewDidLoad() {
    console.log('Hello Balance Page');
    this.load();
  }

  load() {
  	let self = this;
  	this.dataService.getUser().then((res: IUser) => {
      if(res) {
        self.user = res;
        self.loadBalance();
        //self.util.dismissLoading();
      }
    });
  }

  loadBalance() {
  	let self = this;
  	self.dataService.findAll({
      controller: 'loyalty',
      query: { 'userId': { test: "like binary", value: self.user.userId } }
    });
  }

  posNeg(tr) {
  	if(tr.senderId == this.user.userId)
  		return 'balance-neg';
  	else if(tr.recipientId == this.user.userId)
  		return 'balance-pos';

  	return 'balance';
  }
}
