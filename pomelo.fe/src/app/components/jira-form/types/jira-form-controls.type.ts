import { FormControl, FormGroup } from "@angular/forms";
import { IsProjectNeeded } from "../enums/is-project-needed.enum";

export type JiraFormControls = {
  isProjectNeeded: FormControl<IsProjectNeeded | null>;
  existingProjectKey: FormControl<string | null>;
  projectName: FormControl<string | null>;
  projectDescription: FormControl<string | null>;
  projectKey: FormControl<string | null>;
  atlassianId: FormControl<string | null>;
  sprintsCount: FormControl<number | null>;
  sprintDuration: FormControl<number | null>;
  projectStartDate: FormControl<Date | null>;
  epicsCount: FormControl<number | null>;
  issuesCount: FormControl<number | null>;
  issuesTypes: FormGroup<{
    story: FormControl<boolean | null>,
    bug: FormControl<boolean | null>,
    task: FormControl<boolean | null>
  }>
};
