import { Component, Input } from '@angular/core';
import { IUser } from '../../providers/data/interfaces';

@Component({
    selector: 'user',
    templateUrl: 'user.html'
})
export class OfferPostCmp {
    @Input('feed') post: IUser;

    constructor() {}
}