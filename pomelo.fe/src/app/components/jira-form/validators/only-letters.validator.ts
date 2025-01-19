import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CustomErrors } from './form-custom-errors.model';

export function onlyLettersValidator(): ValidatorFn {
  return (control: AbstractControl): CustomErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const onlyLettersRegex = /^[a-zA-Z]+$/;
    const isValid = onlyLettersRegex.test(value);

    return isValid ? null : { onlyLetters: true };
  };
}
