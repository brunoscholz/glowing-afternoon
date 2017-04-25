import { Component, Input, OnInit } from '@angular/core';

import { ITransaction } from '../../modules/common/models/interfaces';

@Component({
  selector: 'transaction-card',
  templateUrl: 'transaction.html'
})
export class TransactionCmp implements OnInit {
  @Input('feed') tr: ITransaction;
  @Input('user') who: string;
  received: boolean = false;
  thumb: string;
  name: string;

  constructor() {}

  ngOnInit() {
    if(this.tr.sender.userId == this.who)
        this.received = false;
    else if(this.tr.recipient.userId == this.who)
        this.received = true;

    // search for seller if rule is buy
    if(this.received) {
      this.thumb = this.tr.sender.buyer.picture.thumbnail;
      this.name = this.tr.sender.buyer.name;
    } else {
      this.thumb = this.tr.recipient.buyer.picture.thumbnail;
      this.name = this.tr.recipient.buyer.name;
    }
  }

  posNeg() {
    if(!this.received)
        return 'balance-neg';
    else
        return 'balance-pos';
  }
}
