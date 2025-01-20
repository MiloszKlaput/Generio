import { FormControl, FormGroup } from "@angular/forms";
import { IsProjectNeeded } from "../enums/is-project-needed.enum";

export type ProjectFormControls = {
  isProjectNeeded: FormControl<IsProjectNeeded | null>;
  existingProjectKey: FormControl<string | null>;
  projectName: FormControl<string | null>;
  projectDescription: FormControl<string | null>;
  projectKey: FormControl<string | null>;
  atlassianId: FormControl<string | null>;
};

export type SprintsFormControls = {
  sprintsCount: FormControl<number | null>;
  sprintDuration: FormControl<number | null>;
  projectStartDate: FormControl<Date | null>;
};

export type EpicsFormControls = {
  epicsCount: FormControl<number | null>;
};

export type IssuesFormControls = {
  issuesCount: FormControl<number | null>;
  issuesTypes: FormGroup<{
    story: FormControl<boolean | null>,
    bug: FormControl<boolean | null>,
    task: FormControl<boolean | null>
  }>;
};
