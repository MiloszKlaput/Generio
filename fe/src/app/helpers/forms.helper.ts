import { FormControl, FormGroup, Validators } from "@angular/forms";
import { whitespaceValidator } from "../validators/whitespace.validator";
import {
  EpicsFormControls,
  IssuesFormControls,
  MainFormControls,
  SprintsFormControls,
  ProjectFormControls,
  UserInfoFormControls
} from "../types/main-form-controls.type";
import { atLeastOneChecked } from "../validators/at-least-one-checked.validator";
import { DateTime } from "luxon";
import { allowedCharactersValidator } from "../validators/allowed-characters.validator";

export class FormsHelper {
  public static initUserInfoForm(): FormGroup<UserInfoFormControls> {
    return new FormGroup<UserInfoFormControls>({
      atlassianLogin: new FormControl<string>('', [Validators.required, whitespaceValidator()]),
      atlassianUserId: new FormControl<string>('', [Validators.required, whitespaceValidator()]),
      atlassianApiKey: new FormControl<string>('', [Validators.required, whitespaceValidator()])
    });
  }

  public static initProjectForm(): FormGroup<ProjectFormControls> {
    return new FormGroup<ProjectFormControls>({
      projectName: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        allowedCharactersValidator(/^[a-zA-Z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż ]*$/),
        whitespaceValidator()
      ]),
      projectDescription: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        allowedCharactersValidator(/^[a-zA-Z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż ]*$/),
        whitespaceValidator()
      ]),
      projectKey: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
        allowedCharactersValidator(/^[a-zA-Z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż]*$/),
        whitespaceValidator()
      ])
    });
  }

  public static initSprintsForm(): FormGroup<SprintsFormControls> {
    return new FormGroup<SprintsFormControls>({
      sprintsCount: new FormControl<number>(1, [
        Validators.required,
        Validators.min(1)
      ]),
      sprintDuration: new FormControl<number>(2),
      projectStartDate: new FormControl<Date>(DateTime.now().toJSDate(), [
        Validators.required
      ])
    });
  }

  public static initEpicsForm(): FormGroup<EpicsFormControls> {
    return new FormGroup<EpicsFormControls>({
      epicsCount: new FormControl<number>(1, [
        Validators.required,
        Validators.min(1)
      ])
    });
  }

  public static initIssuesForm(): FormGroup<IssuesFormControls> {
    return new FormGroup<IssuesFormControls>({
      issuesCount: new FormControl<number>(1, [
        Validators.required,
        Validators.min(1)
      ]),
      issuesTypes: new FormGroup({
        story: new FormControl<boolean>(true),
        bug: new FormControl<boolean>(false),
        task: new FormControl<boolean>(false)
      }, { validators: atLeastOneChecked() })
    });
  }

  public static initMainForm(): FormGroup<MainFormControls> {
    return new FormGroup<MainFormControls>({
      atlassianLogin: new FormControl<string>(''),
      atlassianUserId: new FormControl<string>(''),
      atlassianApiKey: new FormControl<string>(''),
      projectName: new FormControl<string>(''),
      projectDescription: new FormControl<string>(''),
      projectKey: new FormControl<string>(''),
      sprintsCount: new FormControl<number>(1),
      sprintDuration: new FormControl<number>(1),
      projectStartDate: new FormControl<Date>(DateTime.now().toJSDate()),
      epicsCount: new FormControl<number>(1),
      issuesCount: new FormControl<number>(1),
      issuesTypes: new FormGroup({
        story: new FormControl<boolean>(true),
        bug: new FormControl<boolean>(false),
        task: new FormControl<boolean>(false)
      })
    });
  }

  public static mapToMainForm(
    userInfoForm: FormGroup<UserInfoFormControls>,
    projectForm: FormGroup<ProjectFormControls>,
    sprintsForm: FormGroup<SprintsFormControls>,
    epicsForm: FormGroup<EpicsFormControls>,
    issuesForm: FormGroup<IssuesFormControls>,
    mainForm: FormGroup<MainFormControls>) {
    mainForm.patchValue({
      atlassianLogin: userInfoForm.value.atlassianLogin,
      atlassianUserId: userInfoForm.value.atlassianUserId,
      atlassianApiKey: userInfoForm.value.atlassianApiKey,
      projectName: projectForm.value.projectName,
      projectKey: projectForm.value.projectKey,
      projectDescription: projectForm.value.projectDescription,
      sprintsCount: sprintsForm.value.sprintsCount,
      sprintDuration: sprintsForm.value.sprintDuration ? sprintsForm.value.sprintDuration * 7 : null,
      projectStartDate: sprintsForm.value.projectStartDate,
      epicsCount: epicsForm.value.epicsCount,
      issuesCount: issuesForm.value.issuesCount,
      issuesTypes: issuesForm.value.issuesTypes
    });
  }
}
