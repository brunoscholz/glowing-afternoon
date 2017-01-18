import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FollowsPage } from '../../pages/follows/follows';
import { FavoritesPage } from '../../pages/favorites/favorites';
import { ReviewListPage } from '../../pages/review-list/review-list';
import { SettingsPage } from '../../pages/settings/settings';
import { BalancePage } from '../../pages/balance/balance';

import { IProfile } from '../../providers/data/interfaces';

@Component({
    selector: 'user-profile',
    templateUrl: 'user.html'
})
export class UserProfileCmp {
    @Input('feed') profile: IProfile;

    // change based on profile type

    constructor(public navCtrl: NavController) {}

    gotoFollowers(event) {
    	this.navCtrl.push(FollowsPage, {
    		me: true,
    		profile: this.profile
    	});
    }

    gotoFollows(event) {
    	this.navCtrl.push(FollowsPage, {
    		me: false,
    		profile: this.profile
    	});
    }

    gotoFavorites(event) {
    	this.navCtrl.push(FavoritesPage, {
    		profile: this.profile
    	});
    }

    gotoReviews(event) {
    	this.navCtrl.push(ReviewListPage, {
    		profile: this.profile
    	});
    }

    gotoSettings(event) {
    	this.navCtrl.push(SettingsPage, {
            profile: this.profile
        });
    }

    gotoBank(event) {
    	this.navCtrl.push(BalancePage);
    }
}