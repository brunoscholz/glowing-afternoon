import { Component, Input } from '@angular/core';

import { IBuyer } from '../../modules/common/models/interfaces';

@Component({
    selector: 'user-card',
    templateUrl: 'user.html'
})
export class UserCardCmp {
    @Input('feed') buyer: IBuyer;

    constructor() {}
}