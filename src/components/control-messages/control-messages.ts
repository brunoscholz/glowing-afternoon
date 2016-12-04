import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from '../../validators/validators';

@Component({
  selector: 'control-messages',
  template: `<div *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})
export class ControlMessages {
  @Input('control') ctrl: FormControl;

  constructor() { }

  get errorMessage() {
    for (let propertyName in this.ctrl.errors) {
      if (this.ctrl.errors.hasOwnProperty(propertyName) && this.ctrl.touched) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.ctrl.errors[propertyName]);
      }
    }
    
    return null;
  }
}