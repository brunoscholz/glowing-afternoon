import { Component, Input } from '@angular/core';
import { IOffer } from '../../providers/data/interfaces';

@Component({
    selector: 'offer',
    templateUrl: 'offer.html'
})
export class OfferPostCmp {
    @Input('feed') post: IOffer;

    constructor() {
        //moment.locale('pt-br');
    }

    ngOnInit() {
        /*let postID = this.feed.$key;
        this.post = this.socialProvider.getPost(postID);
        this.post
        .subscribe(value => {
            this.offer = this.socialProvider.getUser(value.from);
        });*/
    }
}
