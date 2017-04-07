import { Injectable , ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';

@Injectable()
export class AppErrorHandler extends IonicErrorHandler implements ErrorHandler {
  constructor() { 
    super();
  }

  handleError(err: any): void {
    super.handleError(err);
    try {
      //console.log(err);
      const devServer = (<any>window)['IonicDevServer'];
      if (devServer) {
        devServer.handleError(err);
      }
    } catch (e) {}
  }
}