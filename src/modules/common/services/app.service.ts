import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

import { Helper } from './helper.service';
import { AuthService } from './auth.service';
import { MenuService } from './menu.service';
import { FileUploadService } from './fileUpload.service';
import { UtilityComponent } from '../pages/utilityComponent';

import { Observable, Observer, BehaviorSubject } from 'rxjs/Rx';
/*import moment from 'moment';
import 'moment/src/locale/zh-cn';
import 'moment/src/locale/en-gb';*/


@Injectable()
export class AppService {
  APP_LANGUAGE: string = 'AppLanguage';

  private errorObservable:Observable<any>;
  private errorObserver:Observer<any>;

  private theme: BehaviorSubject<string>;
  availableThemes: {className: string, prettyName: string}[];

  // constructor
  constructor(
    public events: Events,
    public platform: Platform,
    public helper: Helper,
    public authService: AuthService,
    public menuService: MenuService,
    public fileUploadService: FileUploadService,
    public util: UtilityComponent
  ) {
    this.theme = new BehaviorSubject('light-theme');
    this.errorObservable = Observable.create((observer:Observer<any>) => {
      this.errorObserver = observer;
    }).share();
  }

  notifyError(error:Error) {
    this.errorObserver.next(error.message);
  }

  onError(callback:(err:any) => void) {
    this.errorObservable.subscribe(callback);
  }

  setTheme(val) {
    this.theme.next(val);
  }

  getTheme() {
    return this.theme.asObservable();
  }
}
