import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IsProjectNeeded } from "../enums/is-project-needed.enum";
import { onlyLettersValidator } from "../validators/only-letters.validator";
import { EpicsFormControls, IssuesFormControls, JiraFormControls, ProjectFormControls, SprintsFormControls } from "../types/jira-form-controls.type";
import { atLeastOneChecked } from "../validators/at-least-one-checked.validator";

export class InitFormsHelper {
  public static initProjectForm(): FormGroup<ProjectFormControls> {
    return new FormGroup<ProjectFormControls>({
      isProjectNeeded: new FormControl<IsProjectNeeded>(IsProjectNeeded.No, [Validators.required]),
      existingProjectKey: new FormControl<string>('', [Validators.required, Validators.minLength(2), onlyLettersValidator()]),
      projectName: new FormControl<string>({ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]),
      projectDescription: new FormControl<string>({ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]),
      projectKey: new FormControl<string>({ value: '', disabled: true }, [Validators.required, Validators.minLength(2), onlyLettersValidator()]),
      atlassianId: new FormControl<string>({ value: '', disabled: true }, [Validators.required])
    });
  }

  public static initSprintsForm(): FormGroup<SprintsFormControls> {
    return new FormGroup<SprintsFormControls>({
      sprintsCount: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
      sprintDuration: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
      projectStartDate: new FormControl<Date>(new Date(Date.now()), [Validators.required]),
    });
  }

  public static initEpicsForm(): FormGroup<EpicsFormControls> {
    return new FormGroup<EpicsFormControls>({
      epicsCount: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    });
  }

  public static initIssuesForm(): FormGroup<IssuesFormControls> {
    return new FormGroup<IssuesFormControls>({
      issuesCount: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
      issuesTypes: new FormGroup({
        story: new FormControl<boolean>(false),
        bug: new FormControl<boolean>(false),
        task: new FormControl<boolean>(false)
      }, { validators: atLeastOneChecked() })
    });
  }

  public static initMainForm(fp: ProjectFormControls, fs: SprintsFormControls, fe: EpicsFormControls, fi: IssuesFormControls): FormGroup<JiraFormControls> {
    return new FormGroup<JiraFormControls>({
      isProjectNeeded: new FormControl<IsProjectNeeded | null>(fp.isProjectNeeded.value, [Validators.required]),
      existingProjectKey: new FormControl<string | null>(fp.existingProjectKey.value, [Validators.required, Validators.minLength(2), onlyLettersValidator()]),
      projectName: new FormControl<string | null>({ value: fp.projectName.value, disabled: true }, [Validators.required, Validators.minLength(3)]),
      projectDescription: new FormControl<string | null>({ value: fp.projectDescription.value, disabled: true }, [Validators.required, Validators.minLength(3)]),
      projectKey: new FormControl<string | null>({ value: fp.projectKey.value, disabled: true }, [Validators.required, Validators.minLength(2), onlyLettersValidator()]),
      atlassianId: new FormControl<string | null>({ value: fp.atlassianId.value, disabled: true }, [Validators.required]),
      sprintsCount: new FormControl<number | null>(fs.sprintsCount.value, [Validators.required, Validators.min(0)]),
      sprintDuration: new FormControl<number | null>(fs.sprintDuration.value, [Validators.required, Validators.min(1)]),
      projectStartDate: new FormControl<Date | null>(fs.projectStartDate.value, [Validators.required]),
      epicsCount: new FormControl<number | null>(fe.epicsCount.value, [Validators.required, Validators.min(0)]),
      issuesCount: new FormControl<number | null>(fi.issuesCount.value, [Validators.required, Validators.min(0)]),
      issuesTypes: new FormGroup({
        story: new FormControl<boolean | null>(fi.issuesTypes.controls.story),
        bug: new FormControl<boolean | null>(fi.issuesTypes.controls.bug),
        task: new FormControl<boolean | null>(fi.issuesTypes.controls.task)
      }, { validators: atLeastOneChecked() })
    });
  }
}
