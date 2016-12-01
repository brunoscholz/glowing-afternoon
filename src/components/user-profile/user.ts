import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FollowsPage } from '../follows/follows';
import { FavoritesPage } from '../favorites/favorites';
import { ReviewListPage } from '../review-list/review-list';
import { SettingsPage } from '../settings/settings';
import { BalancePage } from '../balance/balance';

import { IProfile } from '../../providers/data/interfaces';

@Component({
    selector: 'user',
    templateUrl: 'user.html'
})
export class UserProfileCmp {
    @Input('feed') profile: IProfile;

    constructor(public navCtrl: NavController) {}

    ngOnInit() {

    }

    gotoFollowers() {
    	this.navCtrl.push(FollowsPage, {
    		me: true;
    	});
    }

    gotoFollows() {
    	this.navCtrl.push(FollowsPage, {
    		me: false;
    	});
    }

    gotoFavorites() {
    	this.navCtrl.push(FavoritesPage);
    }

    gotoReviews() {
    	this.navCtrl.push(ReviewListPage);
    }

    gotoSettings() {
    	this.navCtrl.push(SettingsPage);
    }

    gotoBank() {
    	this.navCtrl.push(BalancePage);
    }
}