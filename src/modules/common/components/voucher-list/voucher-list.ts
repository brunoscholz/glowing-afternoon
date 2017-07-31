import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IVoucherFact } from '../../../common/models/interfaces';

@Component({
    selector: 'voucher-list',
    templateUrl: 'voucher-list.html'
})
export class VoucherListCmp {
    @Input('feed') post: IVoucherFact;
    @Output('consume') consume: EventEmitter<IVoucherFact> = new EventEmitter<IVoucherFact>();

    constructor() {}

    /*let postID = this.feed.$key;
    this.post = this.socialProvider.getPost(postID);
    this.post
    .subscribe(value => {
        this.offer = this.socialProvider.getUser(value.from);
    });*/

    gotoProduct() {

    }

    use() {
        this.consume.emit(this.post);
    }
}
