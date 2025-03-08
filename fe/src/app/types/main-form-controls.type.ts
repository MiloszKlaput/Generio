import { FormControl, FormGroup } from "@angular/forms";


export type UserInfoFormControls = {
  atlassianLogin: FormControl<string | null>;
  atlassianUserId: FormControl<string | null>;
  atlassianApiKey: FormControl<string | null>;
};

export type ProjectFormControls = {
  projectName: FormControl<string | null>;
  projectDescription: FormControl<string | null>;
  projectKey: FormControl<string | null>;
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

export type MainFormControls = {
  atlassianLogin: FormControl<string | null>;
  atlassianUserId: FormControl<string | null>;
  atlassianApiKey: FormControl<string | null>;
  projectName: FormControl<string | null>;
  projectDescription: FormControl<string | null>;
  projectKey: FormControl<string | null>;
  sprintsCount: FormControl<number | null>;
  sprintDuration: FormControl<number | null>;
  projectStartDate: FormControl<Date | null>;
  epicsCount: FormControl<number | null>;
  issuesCount: FormControl<number | null>;
  issuesTypes: FormGroup<{
    story: FormControl<boolean | null>;
    bug: FormControl<boolean | null>;
    task: FormControl<boolean | null>;
  }>;
};
