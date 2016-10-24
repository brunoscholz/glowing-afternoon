import { Pipe, PipeTransform } from '@angular/core';
import _ from 'underscore';

@Pipe({
    name: "orderBy",
    pure: false
})
export class OrderByPipe implements PipeTransform {
  transform(array, args) {
    let sorted = _.sortBy(array, args);
    return sorted; //.reverse()
  }
}