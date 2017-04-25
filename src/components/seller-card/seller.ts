import { Component, Input } from '@angular/core';
import { ISeller } from '../../modules/common/models/interfaces';

@Component({
    selector: 'seller-card',
    templateUrl: 'seller.html'
})
export class SellerCardCmp {
    @Input('feed') seller: ISeller;

    constructor() {}
}