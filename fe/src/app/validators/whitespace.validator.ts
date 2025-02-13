import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function whitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value || '';
    if (value !== value.trim()) {
      return { whitespace: true };
    }
    return null;
  };
}
