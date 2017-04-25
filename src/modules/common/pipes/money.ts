import { Pipe, PipeTransform } from '@angular/core';
 
@Pipe({
  name: 'moneyFormat',
  pure: false
})
export class MoneyPipe implements PipeTransform {
  transform(n: number, params: any[]) {
    let currency = (params[0]) ? params[0] : 'R$';
    return currency + " " + n.toFixed(2).replace(/./g, function(c, i, a) {
      return i && c !== '.' && ((a.length - i) % 3 === 0) ? ',' + c : c;
    });
  }
}