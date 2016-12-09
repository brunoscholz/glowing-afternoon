import { Pipe, PipeTransform } from '@angular/core';
import { ILoyalty } from '../providers/data/interfaces';
 
@Pipe({
  name: 'txFilter',
  pure: false
})
export class TxFilterPipe implements PipeTransform {
  transform(txs: ILoyalty[], params: string[]) {
    if(txs == null) { return []; }
    let query = (params[0]) ? params[0].toLowerCase() : 'all';
    let token = (params[1]) ? params[1].toLowerCase() : 'coin';
    let allTk = (token == 'all') ? true : false;
    let me = txs[0].user.userId;

    if(query == 'all') {
      return txs.filter(loyal =>
        (loyal.transaction.token.name.toLowerCase().indexOf(token) > -1 || allTk)
      );
    }
    else if(query == 'pos') {
      return txs.filter(loyal =>
        (loyal.transaction.token.name.toLowerCase().indexOf(token) > -1 || allTk) &&
        loyal.transaction.recipient.userId.indexOf(me) > -1
      );
    }
    else if(query == 'neg') {
      return txs.filter(loyal =>
        (loyal.transaction.token.name.toLowerCase().indexOf(token) > -1 || allTk) &&
        loyal.transaction.sender.userId.indexOf(me) > -1
      );
    }
    else { return []; }
  }
}