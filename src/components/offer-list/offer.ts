import { Component, Input } from '@angular/core';
import { IOffer } from '../../modules/common/models/interfaces';

@Component({
    selector: 'offer-list',
    templateUrl: 'offer.html'
})
export class OfferListCmp {
    @Input('feed') post: IOffer;

    constructor() {}

    /*let postID = this.feed.$key;
    this.post = this.socialProvider.getPost(postID);
    this.post
    .subscribe(value => {
        this.offer = this.socialProvider.getUser(value.from);
    });*/
}
