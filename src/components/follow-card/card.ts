import { Component, Input, OnInit } from '@angular/core';
import { IFollowFact, IPicture } from '../../providers/data/interfaces';

import _ from 'underscore';

@Component({
    selector: 'follow-card',
    templateUrl: 'card.html'
})
export class FollowCardCmp implements OnInit {
    @Input('feed') fact: IFollowFact;
    profile: IProfCard;

    constructor() {}

    ngOnInit() {
        if(_.size(this.fact.buyer) > 0)
            this.profile = { picture: this.fact.buyer.picture, name: this.fact.buyer.name, about: this.fact.buyer.about };
        else if (_.size(this.fact.seller) > 0)
            this.profile = { picture: this.fact.seller.picture, name: this.fact.seller.name, about: this.fact.seller.about };
        
    }
}

export interface IProfCard {
    picture: IPicture;
    name: string;
    about: string;
}