import { Component, Input, OnInit } from '@angular/core';

import { ITransaction } from '../../models/interfaces';

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

  getRules(id) {
    let arr = {5: 'like',
        6: 'dislike',
        7: 'share',
        9: 'convite',
        10: 'visita',
        11: 'seguir usuário',
        12: '(des)seguir usuário',
        13: 'seguir loja',
        14: '(des)seguir loja',
        15: 'comentar',
        16: 'remover comentário',
        17: 'fazer review',
        18: 'remover review',
        19: 'adicionar aos favoritos',
        20: 'remover dos favoritos',
        22: 'usar voucher',
        23: 'receber voucher',
        24: 'pagar',
        25: 'entregar',
        28: 'alcançar',
        29: 'fazer review',
        30: 'remover review',
        31: 'checkin' };

    return arr[id];
  }

}

