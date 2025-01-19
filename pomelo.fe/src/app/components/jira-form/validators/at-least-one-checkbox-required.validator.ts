import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export function atLeastOneCheckboxRequired(): ValidatorFn {
  return (formGroup: AbstractControl) => {
    console.log(formGroup)
    if (formGroup instanceof FormGroup) {
      for (const key in formGroup) {
        if (formGroup.controls[key].value === true) {
          return null;
        }
      }
      return { atLeastOneCheckboxRequired: true };
    }

    return null;
  }
}
