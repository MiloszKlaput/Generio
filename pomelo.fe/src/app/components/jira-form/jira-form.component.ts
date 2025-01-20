import { Component, inject, OnDestroy, type OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IsProjectNeeded } from './enums/is-project-needed.enum';
import { Subscription } from 'rxjs';
import { atLeastOneChecked } from './validators/at-least-one-checked.validator';
import { onlyLettersValidator } from './validators/only-letters.validator';
import { MatStepperModule } from '@angular/material/stepper';
import { EpicsFormControls, IssuesFormControls, ProjectFormControls, SprintsFormControls } from './types/jira-form-controls.type';

@Component({
  selector: 'jira-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    NativeDateModule,
    MatDatepickerModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatStepperModule,
  ],
  templateUrl: './jira-form.component.html',
  styleUrls: ['./jira-form.component.scss'],
})
export class JiraFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  projectForm!: FormGroup<ProjectFormControls>;
  sprintsForm!: FormGroup<SprintsFormControls>;
  epicsForm!: FormGroup<EpicsFormControls>;
  issuesForm!: FormGroup<IssuesFormControls>;

  IsProjectNeeded = IsProjectNeeded;

  subscriptions: Subscription[] = [];

  get fp(): ProjectFormControls { return this.projectForm.controls; }
  get fs(): SprintsFormControls { return this.sprintsForm.controls; }
  get fe(): EpicsFormControls { return this.epicsForm.controls; }
  get fi(): IssuesFormControls { return this.issuesForm.controls; }

  ngOnInit(): void {
    this.initForms();
    const updateFormSub = this.getUpdateForm();

    this.subscriptions.push(updateFormSub);
  }

  private initForms(): void {
    this.initProjectForm();
    this.initSprintsForm();
    this.initEpicsForm();
    this.initIssuesForm();
  }

  private initProjectForm(): void {
    this.projectForm = new FormGroup({
      isProjectNeeded: new FormControl<IsProjectNeeded>(IsProjectNeeded.No, [Validators.required]),
      existingProjectKey: new FormControl<string>('', [Validators.required, Validators.minLength(2), onlyLettersValidator()]),
      projectName: new FormControl<string>({ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]),
      projectDescription: new FormControl<string>({ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]),
      projectKey: new FormControl<string>({ value: '', disabled: true }, [Validators.required, Validators.minLength(2), onlyLettersValidator()]),
      atlassianId: new FormControl<string>({ value: '', disabled: true }, [Validators.required])
    });
  }

  private initSprintsForm(): void {
    this.sprintsForm = new FormGroup({
      sprintsCount: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
      sprintDuration: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
      projectStartDate: new FormControl<Date>(new Date(Date.now()), [Validators.required]),
    });
  }

  private initEpicsForm(): void {
    this.epicsForm = new FormGroup({
      epicsCount: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    });
  }

  private initIssuesForm(): void {
    this.issuesForm = new FormGroup({
      issuesCount: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
      issuesTypes: new FormGroup({
        story: new FormControl<boolean>(false),
        bug: new FormControl<boolean>(false),
        task: new FormControl<boolean>(false)
      }, { validators: atLeastOneChecked() })
    });
  }

  private updateProjectForm(value: IsProjectNeeded | null): void {
    if (!value) {
      return;
    }

    switch (value) {
      case IsProjectNeeded.Yes:
        this.fp.existingProjectKey.disable();
        this.fp.projectName.enable();
        this.fp.projectDescription.enable();
        this.fp.projectKey.enable();
        this.fp.atlassianId.enable();
        break;

      case IsProjectNeeded.No:
        this.fp.existingProjectKey.enable();
        this.fp.projectName.disable();
        this.fp.projectDescription.disable();
        this.fp.projectKey.disable();
        this.fp.atlassianId.disable();
        break;
    }
  }

  private getUpdateForm(): Subscription {
    return this.fp.isProjectNeeded.valueChanges
      .subscribe(value => this.updateProjectForm(value));
  }

  onSubmit(): void {
    console.log(this.projectForm);
    console.log(this.sprintsForm);
    console.log(this.epicsForm);
    console.log(this.issuesForm);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
