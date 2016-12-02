import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FollowsPage } from '../../pages/follows/follows';
import { FavoritesPage } from '../../pages/favorites/favorites';
import { ReviewListPage } from '../../pages/review-list/review-list';
import { SettingsPage } from '../../pages/settings/settings';
import { BalancePage } from '../../pages/balance/balance';

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
    		me: true,
    		profile: this.profile
    	});
    }

    gotoFollows() {
    	this.navCtrl.push(FollowsPage, {
    		me: false,
    		profile: this.profile
    	});
    }

    gotoFavorites() {
    	this.navCtrl.push(FavoritesPage, {
    		profile: this.profile
    	});
    }

    gotoReviews() {
    	this.navCtrl.push(ReviewListPage, {
    		profile: this.profile
    	});
    }

    gotoSettings() {
    	this.navCtrl.push(SettingsPage);
    }

    gotoBank() {
    	this.navCtrl.push(BalancePage);
    }
}