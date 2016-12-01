import { Component, Input, OnInit, OnChanges } from '@angular/core';
//import {TimeAgoPipe, FromUnixPipe} from 'angular2-moment';
//import { SocialProvider } from '../../providers/social-provider/social-provider';
import { IOffer } from '../../providers/data/interfaces';

@Component({
    selector: 'offer',
    templateUrl: 'offer.html'
})
export class OfferPostCmp {
    @Input('feed') post: IOffer;

    constructor() {}

    ngOnInit() {
        /*let postID = this.feed.$key;
        this.post = this.socialProvider.getPost(postID);
        this.post
        .subscribe(value => {
            this.offer = this.socialProvider.getUser(value.from);
        });*/
    }
}