import { Component, NgZone } from '@angular/core';
import { NavController, ActionSheetController, ModalController } from 'ionic-angular';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';

import { Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../validators/validators';

import { Geolocation, Geoposition } from 'ionic-native';
import { GeocoderService } from '../../providers/map/geocoder.service';
import { MapService } from '../../providers/map/map.service';

import { SetAddressModal } from './address';

@Component({
  templateUrl: 'support.html',
})
export class SupportPage {
  registerForm: any;
	company: any = [];
  address: google.maps.GeocoderResult;
	title: string;

  constructor(private navCtrl: NavController,
              public dataService: DataService,
              private actionSheet: ActionSheetController,
              public util: UtilProvider,
              public modCtrl: ModalController,
              private zone: NgZone,
              public formBuilder: FormBuilder)
  {
    this.company = dataService.getVisitingCompany();
  	this.title = 'Apoio de Vendas';

    //this.address = {};

    this.registerForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      name: ['', Validators.required],
      about: ['', Validators.required],
      license: ['', Validators.required],
      phone: ['', Validators.required],
      cellphone: ['', Validators.required],
      address: ['', Validators.required],

    });//, { validator: ValidationService.matchingPasswords('password', 'confirmPassword')});
  }

  /***
   * get the current location using Geolocation cordova plugin
   * @param maximumAge
   * @returns {Promise<Coordinates>}
   */
  getCurrentPosition(maximumAge: number = 10000): Promise<Coordinates> {
    const options = {
      timeout: 10000,
      enableHighAccuracy: true
    };
    return Geolocation.getCurrentPosition(options)
    .then((pos: Geoposition) => {
      return pos.coords;
    });
  }

  prepare() {
    let self = this;
    if(!self.registerForm.valid) {
      this.util.notifyError(new Error('Por favor preencha todos os campos corretamente!'));
    } else {
      this.getBillingAddress(this.address);
      self.save();
    }
  }

  save() {
    this.dataService.setVisitingCompany(this.company);
    console.log(this.company);
    let toast = this.util.getToast('Informações Salvas');
    toast.onDidDismiss(() => {
      
    });

    toast.present();
  }

  openSearchModal() {
    let modal = this.modCtrl.create(SetAddressModal);
    modal.onDidDismiss((data) => {
      this.zone.run(() => {
        this.address = data;
        this.registerForm.controls['address'].setValue(this.address.formatted_address);
        //this.nearbyPlaces.push.apply(this.nearbyPlaces, _nearbyPlaces);
      });
    });

    modal.present();
  }

  getBillingAddress(data: google.maps.GeocoderResult) {
    // this.util.presentLoading('Aguarde...');
    this.company.billingAddress.address = this.address;
    this.company.billingAddress.latitude = data.geometry.location.lat();
    this.company.billingAddress.longitude = data.geometry.location.lng();

    var street, stNum, c, lc, component;

    for (c = 0, lc = data.address_components.length; c < lc; c += 1) {
      component = data.address_components[c];

      if (component.types[0] === 'locality') {
        this.company.billingAddress.city = component.long_name;
        continue;
      }

      if(component.types[1] == 'sublocality') {
        this.company.billingAddress.neighborhood = component.long_name;
        continue;
      }

      if(component.types[0] == 'route') {
        street = component.long_name;
        continue;
      }

      if(component.types[0] == 'street_number') {
        stNum = component.long_name;
        continue;
      }

      if(component.types[0] == 'administrative_area_level_1') {
        this.company.billingAddress.state = component.short_name;
        continue;
      }

      if(component.types[0] == 'country') {
        this.company.billingAddress.state = component.long_name + " (" + component.short_name + ")";
        continue;
      }
    }
    //console.log(this.company.billingAddress);
  }
}
