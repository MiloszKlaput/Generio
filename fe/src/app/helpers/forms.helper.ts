import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IsProjectNeeded } from "../enums/is-project-needed.enum";
import { whitespaceValidator } from "../validators/whitespace.validator";
import {
  EpicsFormControls,
  IssuesFormControls,
  MainFormControls,
  SprintsFormControls,
  ProjectFormControls
} from "../types/main-form-controls.type";
import { atLeastOneChecked } from "../validators/at-least-one-checked.validator";
import { DateTime } from "luxon";
import { allowedCharactersValidator } from "../validators/allowed-characters.validator";

export class FormsHelper {
  public static initProjectForm(): FormGroup<ProjectFormControls> {
    return new FormGroup<ProjectFormControls>({
      projectName: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        allowedCharactersValidator(/^[a-zA-Z0-9 ]*$/)
      ]),
      projectDescription: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        allowedCharactersValidator(/^[a-zA-Z0-9 ]*$/)
      ]),
      projectKey: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
        allowedCharactersValidator(/^[a-zA-Z0-9-:]*$/),
        whitespaceValidator()
      ]),
      atlassianId: new FormControl<string>('', [Validators.required])
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
      epicsCount: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
    });
  }

  public static initIssuesForm(): FormGroup<IssuesFormControls> {
    return new FormGroup<IssuesFormControls>({
      issuesCount: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
      issuesTypes: new FormGroup({
        story: new FormControl<boolean>(false),
        bug: new FormControl<boolean>(false),
        task: new FormControl<boolean>(false)
      }, { validators: atLeastOneChecked() })
    });
  }

  public static initMainForm(): FormGroup<MainFormControls> {
    return new FormGroup<MainFormControls>({
      projectName: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        allowedCharactersValidator(/^[a-zA-Z0-9 ]*$/)
      ]),
      projectDescription: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        allowedCharactersValidator(/^[a-zA-Z0-9 ]*$/)
      ]),
      projectKey: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
        allowedCharactersValidator(/^[a-zA-Z]*$/)
      ]),
      atlassianId: new FormControl<string>('', [Validators.required]),
      sprintsCount: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
      sprintDuration: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
      projectStartDate: new FormControl<Date>(DateTime.now().toJSDate(), [Validators.required]),
      epicsCount: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
      issuesCount: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
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
      projectName: projectForm.value.projectName,
      projectKey: projectForm.value.projectKey,
      projectDescription: projectForm.value.projectDescription,
      atlassianId: projectForm.value.atlassianId,
      sprintsCount: sprintsForm.value.sprintsCount,
      sprintDuration: sprintsForm.value.sprintDuration ? sprintsForm.value.sprintDuration * 7 : null,
      projectStartDate: sprintsForm.value.projectStartDate,
      epicsCount: epicsForm.value.epicsCount,
      issuesCount: issuesForm.value.issuesCount,
      issuesTypes: issuesForm.value.issuesTypes
    });
  }
}
