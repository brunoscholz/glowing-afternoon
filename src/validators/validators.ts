import { FormControl, FormGroup } from '@angular/forms';

export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
      let config = {
        'required': 'Required',
        'invalidCreditCard': 'Is invalid credit card number',
        'invalidEmailAddress': 'Invalid email address',
        'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
        'minlength': `Minimum length ${validatorValue.requiredLength}`,
        'notEquivalent': 'Passwords does not match'
      };

      return config[validatorName];
    }

    static creditCardValidator(control) {
      // Visa, MasterCard, American Express, Diners Club, Discover, JCB
      if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
        return null;
      } else {
        return { 'invalidCreditCard': true };
      }
    }

    static checkUsername(control: FormControl): any {
      return new Promise(resolve => {
        //Fake a slow response from server
        setTimeout(() => {
          if(control.value.toLowerCase() === "greg") {
   
            resolve({
              "username taken": true
            });
   
          } else {
            resolve(null);
          }
        }, 2000);
   
      });
    }

    static emailValidator(control) {
      // RFC 2822 compliant regex
      if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
        return null;
      } else {
        return { 'invalidEmailAddress': true };
        //return { validateEmail: { valid: false } };
      }
    }

    static passwordValidator(control) {
      // {6,100}           - Assert password is between 6 and 100 characters
      // (?=.*[0-9])       - Assert a string has at least one number
      if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,100}$/)) {
        return null;
      } else {
        return { 'invalidPassword': true };
      }
    }

    static matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
      return (group: FormGroup) => {
        let passwordInput = group.controls[passwordKey];
        let passwordConfirmationInput = group.controls[passwordConfirmationKey];
        if (passwordInput.value !== passwordConfirmationInput.value) {
          return passwordConfirmationInput.setErrors({notEquivalent: true})
        }
      }
    }
}