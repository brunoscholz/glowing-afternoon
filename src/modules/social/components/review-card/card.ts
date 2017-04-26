import { Component, Input, OnInit } from '@angular/core';

import { IReviewFact, IPicture } from '../../../common/models/interfaces';

import _ from 'underscore';

@Component({
  selector: 'review-card',
  templateUrl: 'card.html'
})
export class ReviewCardCmp implements OnInit {
  @Input('feed') fact: IReviewFact;
  target: ITargetCard;

  constructor() {}

  ngOnInit() {
    if(_.size(this.fact.offer) > 0)
      this.target = { picture: this.fact.offer.picture };
    else if (_.size(this.fact.seller) > 0)
      this.target = { picture: this.fact.seller.picture };
  }
}

export interface ITargetCard {
  picture: IPicture;
}