import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, Events } from 'ionic-angular';
import { Network } from '@ionic-native/network';

import { TimeagoPipe } from './pipes/time-ago';
import { OrderByPipe } from './pipes/order-by';
import { TxFilterPipe } from './pipes/tx-filter';
import { MoneyPipe } from './pipes/money';
import { CounterPipe } from './pipes/counter';
import { ArrayFilterPipe } from './pipes/array-filter';

//import { ModelPage } from './pages/model-page';

import { AppService } from './services/app.service';
import { ApiService } from './services/api.service';
import { Helper } from './services/helper.service';
import { AuthService } from './services/auth.service';
import { MenuService } from './services/menu.service';
import { FileUploadService } from './services/fileUpload.service';
import { ConnectivityService } from './services/connectivity.service';
import { SpeechService } from './services/speech.service';

import { UtilityComponent } from './pages/utilityComponent';

import { TransactionCmp } from './components/transaction/transaction';
import { EmptyListCmp } from './components/empty/empty';
import { RatingCmp } from './components/star-rating/rating';
import { ControlMessages } from './components/control-messages/control-messages';
import { VoucherListCmp } from './components/voucher-list/voucher-list';

@NgModule({
  imports: [
    IonicModule,
    IonicStorageModule.forRoot(),
  ],
  declarations: [
    TimeagoPipe,
    OrderByPipe,
    TxFilterPipe,
    MoneyPipe,
    CounterPipe,
    ArrayFilterPipe,
    UtilityComponent,
    TransactionCmp,
    EmptyListCmp,
    RatingCmp,
    ControlMessages,
    VoucherListCmp,
  ],
  entryComponents: [
  ],
  providers: [
    Storage,
    Network,
    Helper,
    AppService,
    ApiService,
    AuthService,
    MenuService,
    FileUploadService,
    ConnectivityService,
    SpeechService,
    UtilityComponent
  ],
  exports: [
    IonicModule,
    TimeagoPipe,
    OrderByPipe,
    TxFilterPipe,
    MoneyPipe,
    CounterPipe,
    ArrayFilterPipe,
    TransactionCmp,
    EmptyListCmp,
    RatingCmp,
    ControlMessages,
    VoucherListCmp,
  ]
})

export class CommonModule {
  constructor(
    public theApp: AppService,
    public events: Events,
    public utilityComp: UtilityComponent
  ) {
    // subscribe events
    this.subscribeEvents();

    // utilityComp register events
    this.utilityComp.registerEvents();
  }

  // Subscribe events
  subscribeEvents() {
    // subscribe auth logIn
    this.events.subscribe('auth:logIn', (userInfo) => {
      this.theApp.authService.logIn(userInfo);
    });

    this.events.subscribe('auth:saveAuth', (token) => {
      this.theApp.authService.StoreAuthToken(token);
    });

    // subscribe auth logOut
    this.events.subscribe('auth:logOut', () => {
      this.theApp.authService.logOut();
    });

    // this.events.subscribe('auth:loggedIn', () => {
    //   //this.theApp.menuService.loggedIn();
    // });
  }
}