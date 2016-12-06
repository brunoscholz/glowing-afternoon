import { Component, Input } from '@angular/core';
import { IUser } from '../../providers/data/interfaces';

@Component({
    selector: 'user-card',
    templateUrl: 'user.html'
})
export class UserCardCmp {
    @Input('feed') post: IUser;

    constructor() {}
}