import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';

//import { IUser, IBuyer, ISeller } from '../../common/models/interfaces';
import { Helper } from '../../common/services/helper.service';
import { ApiService } from '../../common/services/api.service';
// import { AppService } from '../../common/services/app.service';
// import { UserService } from '../../user/services/user.service';

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

  addSocialAction(options) {
    let uri = options.controller || 'follow-facts';
    let url: string = this.helper.getAPI(uri);
    
    return this.api.post(url, options.data)
    .catch(this.handleError);
  }

  // handle error
  private handleError(error: any) {
    return Promise.reject(error.message || error);
  }
}
