import { Component, OnDestroy, type OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { IsProjectNeeded } from '../../enums/is-project-needed.enum';
import { Subscription } from 'rxjs';
import { atLeastOneChecked } from '../../validators/at-least-one-checked.validator';
import { onlyLettersValidator } from '../../validators/only-letters.validator';
import { MatStepperModule } from '@angular/material/stepper';
import { EpicsFormControls, IssuesFormControls, JiraFormControls, ProjectFormControls, SprintsFormControls } from '../../types/jira-form-controls.type';
import { InitFormsHelper } from '../../helpers/init-forms.helper';

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
  projectForm!: FormGroup<ProjectFormControls>;
  sprintsForm!: FormGroup<SprintsFormControls>;
  epicsForm!: FormGroup<EpicsFormControls>;
  issuesForm!: FormGroup<IssuesFormControls>;
  mainForm!: FormGroup<JiraFormControls>;
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
    this.projectForm = InitFormsHelper.initProjectForm();
    this.sprintsForm = InitFormsHelper.initSprintsForm();
    this.epicsForm = InitFormsHelper.initEpicsForm();
    this.issuesForm = InitFormsHelper.initIssuesForm();
    this.mainForm = InitFormsHelper.initMainForm(this.fp, this.fs, this.fe, this.fi);
  }

  private updateProjectForm(value: IsProjectNeeded): void {
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
      .subscribe(value => {
        if (!value) {
          return;
        }

        this.updateProjectForm(value);
      });
  }

  onSubmit(): void {
    console.log(this.mainForm);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
