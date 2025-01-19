import { Component, inject, OnDestroy, type OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { atLeastOneCheckboxRequired } from './validators/at-least-one-checkbox-required.validator';
import { IsProjectNeeded } from './enums/is-project-needed.enum';
import { JiraFormControls } from './types/jira-form-controls.type';
import { Subscription } from 'rxjs';


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
    MatNativeDateModule
  ],
  templateUrl: './jira-form.component.html',
  styleUrls: ['./jira-form.component.scss'],
})
export class JiraFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  form!: FormGroup<JiraFormControls>;

  IsProjectNeeded = IsProjectNeeded;

  subscriptions: Subscription[] = [];

  get f(): JiraFormControls {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.initForm();
    const updateFormSub = this.getUpdateForm();

    this.subscriptions.push(updateFormSub);
  }

  // TO DO wrzucić typowanie
  private initForm(): void {
    this.form = this.fb.group({
      isProjectNeeded: [IsProjectNeeded.No, [Validators.required]],
      existingProjectKey: ['', [Validators.required]],
      projectName: ['', [Validators.required]],
      projectDescription: ['', [Validators.required]],
      projectKey: ['', [Validators.required]],
      atlassianId: ['', [Validators.required]],
      sprintsCount: [0, [Validators.required, Validators.min(0)]],
      sprintDuration: [1, [Validators.required, Validators.min(1)]],
      projectStartDate: [new Date(Date.now()), [Validators.required]],
      epicsCount: [0, [Validators.required, Validators.min(0)]],
      issuesCount: [0, [Validators.required, Validators.min(0)]],
      issuesTypes: this.fb.group({
        story: false,
        bug: false,
        task: false
      }, atLeastOneCheckboxRequired())
    });
  }

  private updateForm(value: IsProjectNeeded | null): void {
    if (!value) {
      return;
    }

    switch (value) {
      case IsProjectNeeded.Yes:
        this.f.existingProjectKey.disable();
        this.f.projectName.enable();
        this.f.projectDescription.enable();
        this.f.projectKey.enable();
        this.f.atlassianId.enable();
        break;

      case IsProjectNeeded.No:
        this.f.existingProjectKey.enable();
        this.f.projectName.disable();
        this.f.projectDescription.disable();
        this.f.projectKey.disable();
        this.f.atlassianId.disable();
        break;
    }
  }

  private getUpdateForm(): Subscription {
    return this.f.isProjectNeeded.valueChanges
      .subscribe(value => this.updateForm(value));
  }

  onSubmit(): void {
    console.log(this.form);
  }

  ngOnDestroy(): void {

  }
}
