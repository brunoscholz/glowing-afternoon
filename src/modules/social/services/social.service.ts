import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';

import { Facebook } from 'ionic-native';

import { Helper } from '../../common/services/helper.service';
import { ApiService } from '../../common/services/api.service';
// import { AppService } from '../../common/services/app.service';
// import { UserService } from '../../user/services/user.service';

import { IShare } from '../../common/models/interfaces';

@Injectable()
export class SocialService {
  

  constructor(
    public events: Events,
    private helper: Helper,
    public api: ApiService
  ) {
    
  }

  // get favorites
  getFavorites(options: any) {
    let uri = options.controller || 'favorite-facts';
    let url: string = this.helper.getAPI(uri);

    return this.api.get(url, options)
    .catch(this.handleError);
  }

  // get reviews
  getReviews(options: any) {
    let uri = options.controller || 'review-facts';
    let url: string = this.helper.getAPI(uri);

    return this.api.get(url, options)
    .catch(this.handleError);
  }

  // get follows
  getFollows(options: any) {
    let uri = options.controller || 'follow-facts';
    let url: string = this.helper.getAPI(uri);

    return this.api.get(url, options)
    .catch(this.handleError);
  }

  setFavorite(options: any) {
    let url: string = this.helper.getAPI('favorite-facts');
    let id = options.favoriteId || '';
    if(id != '' && id != undefined)
      url = url + '/' + id;

    return this.api.post(url, options.data)
    .catch(this.handleError);
  }

  setReview(options: any) {
    let url: string = this.helper.getAPI('review-facts');
    let id = options.reviewId || '';
    if(id != '' && id != undefined)
      url = url + '/' + id;

    return this.api.post(url, options.data)
    .catch(this.handleError);
  }

  setFollow(options: any) {
    let url: string = this.helper.getAPI('follow-facts');
    let id = options.followId || '';
    if(id != '' && id != undefined)
      url = url + '/' + id;

    return this.api.post(url, options.data)
    .catch(this.handleError);
  }

  shareWithFacebook(data: IShare) {
    //var options = { method:"feed" };
    let promise = new Promise((resolve, reject) => {
      Facebook.getLoginStatus()
      .then((response) => {
        if (response.status == 'connected') {
          Facebook.showDialog({
            method: "share",
            href: "http://ondetem-gn.com.br/site/story/" + data.id,
            caption: data.caption,
            description: data.description,
            quote: data.quote,
            picture: data.picture,
            hashtag: '#ondetem'
          })
          .then((result) => {
            resolve(true);
          }, (error) => {
            reject(error);
          });
        }
        reject(new Error('Não conectado ao Facebook'));
      })
      .catch((err) => {
        //this.theApp.notifyError(err);
      });
    });
    return promise;
  }

  share(options: any) {
    // ShareFact[action]:share
    // ShareFact[buyerId]:n6cXcvhdOKc8oog48uBDb
    // ShareFact[offerId]:7sB7UtHBUMFDyt0XnrML9
  }

  checkinWithFacebook(data) {
    //var options = { method:"feed" };
    let promise = new Promise((resolve, reject) => {
      /*Facebook.getLoginStatus()
      .then((response) => {
        if (response.status == 'connected') {

          Facebook.api("/me/feed", 'post' {
            name: 'SomeName',
            message: 'SomeMessage',
            place: '106039436102339' // ID for Tallinn, Estonia
          })
          .then((result) => {
            resolve(true);
          }, (error) => {
            reject(error);
          });
        }
        reject(new Error('Não conectado ao Facebook'));
      })
      .catch((err) => {
        //this.theApp.notifyError(err);
      });*/
    });
    return promise;
  }

  checkin(options: any) {
    // CheckinFact[action]:checkin
    // CheckinFact[buyerId]:n6cXcvhdOKc8oog48uBDb
    // CheckinFact[sellerId]:LF3LsfWa2aUbmSPHOP2PY
  }

  /*addSocialAction(options) {
    let uri = options.controller || 'follow-facts';
    let url: string = this.helper.getAPI(uri);
    
    return this.api.post(url, options.data)
    .catch(this.handleError);
  }*/

  // handle error
  private handleError(error: any) {
    return Promise.reject(error.message || error);
  }
}
