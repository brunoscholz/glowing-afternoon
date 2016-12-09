import { Component, Input } from '@angular/core';

@Component({
    selector: 'empty-list',
    templateUrl: 'empty.html'
})
export class EmptyListCmp {
    @Input('msg') message: string;

    constructor() {}
}
