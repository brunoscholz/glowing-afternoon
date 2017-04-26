import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';

//import { IUser, IBuyer, ISeller } from '../../common/models/interfaces';
import { Helper } from '../../common/services/helper.service';
import { ApiService } from '../../common/services/api.service';
import { AppService } from '../../common/services/app.service';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class SocialService {
  

  constructor(
    public events: Events,
    private helper: Helper,
    public api: ApiService
  ) {
    
  }


  // handle error
  private handleError(error: any) {
    return Promise.reject(error.message || error);
  }
}
