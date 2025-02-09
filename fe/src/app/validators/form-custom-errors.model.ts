import { ValidationErrors } from "@angular/forms";

export interface CustomErrors extends ValidationErrors {
  onlyLetter?: boolean;
  atLeastOneChecked?: boolean;
}
