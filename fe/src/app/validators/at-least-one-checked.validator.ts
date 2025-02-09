import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CustomErrors } from './form-custom-errors.model';

export function atLeastOneChecked(): ValidatorFn {
  return (formGroup: AbstractControl): CustomErrors | null => {
    if (!formGroup || !formGroup.value) {
      return null;
    }

    const isAtLeastOneChecked = Object.values(formGroup.value).some(value => value === true);

    return isAtLeastOneChecked ? null : { atLeastOneChecked: true };
  };
}
