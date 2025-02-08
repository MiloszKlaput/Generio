import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IsProjectNeeded } from "../enums/is-project-needed.enum";
import { onlyLettersValidator } from "../validators/only-letters.validator";
import {
  ExistingProjectFormControls,
  NewProjectFormControls,
  EpicsFormControls,
  IssuesFormControls,
  MainFormControls,
  SprintsFormControls,
  ProjectFormControls
} from "../types/main-form-controls.type";
import { atLeastOneChecked } from "../validators/at-least-one-checked.validator";
import { DateTime } from "luxon";

export class FormsHelper {
  public static initExistingProjectForm(): FormGroup<ExistingProjectFormControls> {
    return new FormGroup<ExistingProjectFormControls>({
      existingProjectKey: new FormControl<string>('', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z]*$/), onlyLettersValidator()])
    });
  }

  public static initNewProjectForm(): FormGroup<NewProjectFormControls> {
    return new FormGroup<NewProjectFormControls>({
      projectName: new FormControl<string>({ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9 ]*$/)]),
      projectDescription: new FormControl<string>({ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9 ]*$/)]),
      projectKey: new FormControl<string>({ value: '', disabled: true }, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9-:]*$/), onlyLettersValidator()]),
      atlassianId: new FormControl<string>({ value: '', disabled: true }, [Validators.required])
    });
  }

  public static initProjectForm(): FormGroup<ProjectFormControls> {
    return new FormGroup<ProjectFormControls>({
      isNewProjectNeeded: new FormControl<IsProjectNeeded>(IsProjectNeeded.No),
      existingProject: FormsHelper.initExistingProjectForm(),
      newProject: FormsHelper.initNewProjectForm()
    });
  }

  public static initSprintsForm(): FormGroup<SprintsFormControls> {
    return new FormGroup<SprintsFormControls>({
      sprintsCount: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
      sprintDuration: new FormControl<number>(2),
      projectStartDate: new FormControl<Date>(DateTime.now().toJSDate(), [Validators.required]),
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

  public static initMainForm(): FormGroup<MainFormControls> {
    return new FormGroup<MainFormControls>({
      isProjectNeeded: new FormControl<IsProjectNeeded>(IsProjectNeeded.No, [Validators.required]),
      existingProjectKey: new FormControl<string>('', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z]*$/), onlyLettersValidator()]),
      projectName: new FormControl<string>({ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9 ]*$/)]),
      projectDescription: new FormControl<string>({ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9 ]*$/)]),
      projectKey: new FormControl<string>({ value: '', disabled: true }, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z]*$/), onlyLettersValidator()]),
      atlassianId: new FormControl<string>({ value: '', disabled: true }, [Validators.required]),
      sprintsCount: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
      sprintDuration: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
      projectStartDate: new FormControl<Date>(DateTime.now().toJSDate(), [Validators.required]),
      epicsCount: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
      issuesCount: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
      issuesTypes: new FormGroup({
        story: new FormControl<boolean>(false),
        bug: new FormControl<boolean>(false),
        task: new FormControl<boolean>(false)
      }, { validators: atLeastOneChecked() })
    });
  }

  public static mapToMainForm(
    projectForm: FormGroup<ProjectFormControls>,
    sprintsForm: FormGroup<SprintsFormControls>,
    epicsForm: FormGroup<EpicsFormControls>,
    issuesForm: FormGroup<IssuesFormControls>,
    mainForm: FormGroup<MainFormControls>) {
    mainForm.patchValue({
      isProjectNeeded: projectForm.controls.isNewProjectNeeded.value,
      existingProjectKey: projectForm.controls.existingProject.value.existingProjectKey,
      projectName: projectForm.controls.newProject.value.projectName,
      projectKey: projectForm.controls.newProject.value.projectKey,
      projectDescription: projectForm.controls.newProject.value.projectDescription,
      atlassianId: projectForm.controls.newProject.value.atlassianId,
      sprintsCount: sprintsForm.value.sprintsCount,
      sprintDuration: sprintsForm.value.sprintDuration ? sprintsForm.value.sprintDuration * 7 : null,
      projectStartDate: sprintsForm.value.projectStartDate,
      epicsCount: epicsForm.value.epicsCount,
      issuesCount: issuesForm.value.issuesCount,
      issuesTypes: issuesForm.value.issuesTypes
    });
  }
}
