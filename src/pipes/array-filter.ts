import { Pipe, PipeTransform } from "@angular/core";
/*
 * Filter array options
 * Usage:
 *   date | emTimeAgo
*/

@Pipe({
  name: "arrayFilter"
})
export class ArrayFilterPipe implements PipeTransform {
  transform(items: Array<any>, params: Array<string>) {
    if(items == null || params == null) { return null; }  

    // let retZero = (params[0]) ? true : false;
    // let desc = (params[1]) ? params[1] : '';
    // let showDesc = (params[2]) ? params[2] : true;

    let query = params[0].toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().indexOf(query) > -1
      //item.category.name.toLowerCase().indexOf(query) > -1 ||
    );
  }
}