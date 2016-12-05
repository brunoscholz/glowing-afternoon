import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../providers/auth/auth.service';
import 'rxjs/add/operator/debounceTime';

export class ValidationService {

  constructor(public auth: AuthService) {}

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      'required': 'Campo obrigatório',
      'invalidCreditCard': 'Número do cartão é inválido',
      'invalidEmailAddress': 'Email inválido',
      'invalidPassword': 'Senha inválida. Deve conter pelo menos 8 caracteres, e 1 (um) número.',
      'notEquivalent': 'As senhas devem ser iguais.',
      'usernameTaken': 'Já existe esse email no cadastro...'
    };

      //'minlength': `Tamanho mínimo ${validatorValue.requiredLength}`
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

  static emailValidator(control) {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  }

  static passwordValidator(control) {
    // {8,100}           - Assert password is between 8 and 100 characters
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
        return passwordConfirmationInput.setErrors( { 'notEquivalent': true} );
      }
    }
  }

  static checkUsername(control: FormControl): any {
    return new Promise(resolve => {
      //Fake a slow response from server
      control.valueChanges
        .debounceTime(500)
        .distinctUntilChanged()
        .subscribe((term: string) => {
          if(control.value.toLowerCase() === "greg@greg.me") {
            console.log('term: ' + term);
            resolve({ usernameTaken: true });
          } else {
            resolve(null);
          }
        });
        /*.switchMap((value: string) => {
          // Get data according to the filled value
          return this.auth.checkUsername(value);
        })
        .subscribe(data => {
          // Update the linked list
          this.list = data;
        });*/
      
      /*setTimeout(() => {          
      }, 2000);*/
 
    });
  }
}