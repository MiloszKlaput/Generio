import { FormControl } from "@angular/forms";

export type ProcessFormControls = {
  atlassianLogin: FormControl<string | null>;
  atlassianUserId: FormControl<string | null>;
  atlassianApiKey: FormControl<string | null>;
  atlassianUserJiraUrl: FormControl<string | null>;
};
