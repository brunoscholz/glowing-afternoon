import { Component, Input, OnInit } from '@angular/core';
import { ILoyalty } from '../../providers/data/interfaces';

@Component({
  selector: 'transaction-card',
  templateUrl: 'transaction.html'
})
export class TransactionCmp implements OnInit {
  @Input('feed') tr: ILoyalty;
  received: boolean = false;
  thumb: string;
  name: string;

  constructor() {}

  ngOnInit() {
    if(this.tr.transaction.sender.userId == this.tr.user.userId)
        this.received = false;
    else if(this.tr.transaction.recipient.userId == this.tr.user.userId)
        this.received = true;

    // search for seller if rule is buy
    if(this.received) {
      this.thumb = this.tr.transaction.sender.buyer.picture.thumbnail;
      this.name = this.tr.transaction.sender.buyer.name;
    } else {
      this.thumb = this.tr.transaction.recipient.buyer.picture.thumbnail;
      this.name = this.tr.transaction.recipient.buyer.name;
    }
  }

  posNeg() {
    if(!this.received)
        return 'balance-neg';
    else
        return 'balance-pos';
  }
}
