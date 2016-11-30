import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { LoadingService } from '../../providers/utils/loading.service';

import { IBuyer } from '../../providers/data/interfaces';
import { ModelPage } from '../model-page';

//import {Camera} from 'ionic-native';

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html',
})
export class SettingsPage extends ModelPage implements OnInit {
	user: IBuyer = null;
  username: string;

  constructor(private navCtrl: NavController,
              public dataService: DataService,
              public loading: LoadingService,
              public authService: AuthService,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController) {
  	super('Configurações', dataService, loading)
    //this.user = authService.
  }

  ngOnInit() {
    
  }
}
