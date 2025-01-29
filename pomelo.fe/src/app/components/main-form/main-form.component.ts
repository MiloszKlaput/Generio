import { Component, inject, OnDestroy, type OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { map, Observable, Subscription } from 'rxjs';
import { MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { MatGridListModule } from '@angular/material/grid-list';
import {
  EpicsFormControls,
  ExistingProjectFormControls,
  IssuesFormControls,
  MainFormControls,
  NewProjectFormControls,
  ProjectFormControls,
  SprintsFormControls
} from '../../types/main-form-controls.type';
import { FormsHelper } from '../../helpers/forms.helper';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';


@Component({
  selector: 'main-form',
  imports: [
    CommonModule,
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
    MatCardModule,
    MatGridListModule
  ],
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss'],
})
export class MainFormComponent implements OnInit, OnDestroy {
  projectForm!: FormGroup<ProjectFormControls>;
  sprintsForm!: FormGroup<SprintsFormControls>;
  epicsForm!: FormGroup<EpicsFormControls>;
  issuesForm!: FormGroup<IssuesFormControls>;
  mainForm!: FormGroup<MainFormControls>;

  stepperOrientation$!: Observable<StepperOrientation>;

  IsProjectNeeded = IsProjectNeeded;

  subscriptions: Subscription[] = [];

  get fpe(): ExistingProjectFormControls { return this.projectForm.controls.existingProject.controls }
  get fpn(): NewProjectFormControls { return this.projectForm.controls.newProject.controls; }
  get fp(): ProjectFormControls { return this.projectForm.controls; }
  get fs(): SprintsFormControls { return this.sprintsForm.controls; }
  get fe(): EpicsFormControls { return this.epicsForm.controls; }
  get fi(): IssuesFormControls { return this.issuesForm.controls; }

  constructor() {
    const breakpointObserver = inject(BreakpointObserver);
    this.stepperOrientation$ = breakpointObserver
      .observe('(min-width: 1023px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.initForms();
    const updateFormSub = this.getUpdateForm();

    this.subscriptions.push(updateFormSub);
  }

  private initForms(): void {
    this.projectForm = FormsHelper.initProjectForm();
    this.sprintsForm = FormsHelper.initSprintsForm();
    this.epicsForm = FormsHelper.initEpicsForm();
    this.issuesForm = FormsHelper.initIssuesForm();
    this.mainForm = FormsHelper.initMainForm();
  }

  private getUpdateForm(): Subscription {
    return this.fp.isNewProjectNeeded.valueChanges
      .subscribe(value => {
        if (!value) {
          return;
        }

        this.updateProjectForm(value);
      });
  }

  private updateProjectForm(value: IsProjectNeeded): void {
    if (!value) {
      return;
    }

    switch (value) {
      case IsProjectNeeded.Yes:
        this.projectForm.controls.existingProject.disable();
        this.projectForm.controls.newProject.enable();
        break;

      case IsProjectNeeded.No:
        this.projectForm.controls.existingProject.enable();
        this.projectForm.controls.newProject.disable();
        break;

      default:
        break;
    }
  }

  onSubmit(): void {
    FormsHelper.mapToMainForm(this.projectForm, this.sprintsForm, this.epicsForm, this.issuesForm, this.mainForm);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
