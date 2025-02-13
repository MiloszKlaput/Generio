import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function allowedCharactersValidator(allowedPattern: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || typeof control.value !== 'string') {
      return null;
    }
    const pattern = new RegExp(allowedPattern.source, allowedPattern.flags.replace(/g/, ''));
    const forbiddenChars: string[] = [];
    for (const char of control.value) {
      if (!pattern.test(char)) {
        forbiddenChars.push(char);
      }
    }

    return forbiddenChars.length > 0 ? { forbiddenCharacters: forbiddenChars } : null;
  };
}
