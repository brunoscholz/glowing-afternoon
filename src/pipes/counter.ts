import { Pipe, PipeTransform } from '@angular/core';
//import _ from 'underscore';

@Pipe({
  name: "counter",
  pure: false
})
export class CounterPipe implements PipeTransform {
  transform(n: number, params: any[]) {
    let retZero = (params[0]) ? true : false;
    let desc = (params[1]) ? params[1] : '';
    let showDesc = (params[2]) ? params[2] : true;
    if(n == null || n == 0) { return (retZero ? '0 ' + (showDesc ? desc : '') : ''); }

    return this.nFormatter(n, 1)  + ' ' + (showDesc ? desc : '');
  }

  nFormatter(num, digits) {
    var si = [
    { value: 1E18, symbol: "E" },
    { value: 1E15, symbol: "P" },
    { value: 1E12, symbol: "T" },
    { value: 1E9,  symbol: "G" },
    { value: 1E6,  symbol: "M" },
    { value: 1E3,  symbol: "k" }
    ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
    for (i = 0; i < si.length; i++) {
      if (num >= si[i].value) {
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
      }
    }
    return num.toFixed(digits).replace(rx, "$1");
  }
}
