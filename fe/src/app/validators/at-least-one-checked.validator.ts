import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function atLeastOneChecked(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    if (!formGroup || !formGroup.value) {
      return null;
    }

    const isAtLeastOneChecked = Object.values(formGroup.value).some(value => value === true);

    return isAtLeastOneChecked ? null : { atLeastOneChecked: true };
  };
}
