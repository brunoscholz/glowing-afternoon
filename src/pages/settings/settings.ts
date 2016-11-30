import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

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
              public authService: AuthService,
              public util: UtilProvider) {
  	super('Configurações', dataService, util)
    //this.user = authService.
  }

  ngOnInit() {
    
  }
}
