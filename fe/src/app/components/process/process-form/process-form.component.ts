import { Component, inject, OnDestroy, ViewChild, type OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { map, Observable, Subscription } from 'rxjs';
import { MatStepper, MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { MatGridListModule } from '@angular/material/grid-list';
import { EpicsFormControls, IssuesFormControls, MainFormControls, ProjectFormControls, SprintsFormControls } from '../../../types/main-form-controls.type';
import { FormsHelper } from '../../../helpers/forms.helper';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatRadioModule } from '@angular/material/radio';
import { JiraPopulateProcessService } from '../../../services/jira-populate-process.service';
import { ProcessStateService } from '../../../services/process-state.service';
import { ProcessState } from '../../../enums/process-state.enum';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'process-form',
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
    MatGridListModule,
    MatRadioModule,
    TranslateModule
  ],
  templateUrl: './process-form.component.html',
  styleUrls: ['./process-form.component.scss'],
  standalone: true
})
export class ProcessFormComponent implements OnInit, OnDestroy {
  private populateProcessService = inject(JiraPopulateProcessService);
  @ViewChild('stepper') stepper!: MatStepper;
  projectForm!: FormGroup<ProjectFormControls>;
  sprintsForm!: FormGroup<SprintsFormControls>;
  epicsForm!: FormGroup<EpicsFormControls>;
  issuesForm!: FormGroup<IssuesFormControls>;
  mainForm!: FormGroup<MainFormControls>;
  isInProgress = false;
  isSubmitted = false;

  stepperOrientation$!: Observable<StepperOrientation>;

  subscriptions: Subscription[] = [];

  get fp(): ProjectFormControls { return this.projectForm.controls; }
  get fs(): SprintsFormControls { return this.sprintsForm.controls; }
  get fe(): EpicsFormControls { return this.epicsForm.controls; }
  get fi(): IssuesFormControls { return this.issuesForm.controls; }
  get fM(): MainFormControls { return this.mainForm.controls; }

  constructor() {
    const breakpointObserver = inject(BreakpointObserver);
    this.stepperOrientation$ = breakpointObserver
      .observe('(min-width: 960px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.initForms();
  }

  onBlur(control: AbstractControl): void {
    if (control && typeof control.value === 'string') {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }

  onReset(): void {
    this.projectForm.reset();
    this.initForms();
    this.stepper.reset();
  }

  onSubmit(): void {
    FormsHelper.mapToMainForm(this.projectForm, this.sprintsForm, this.epicsForm, this.issuesForm, this.mainForm);

    this.populateProcessService.startProcess(this.fM);
  }

  private initForms(): void {
    this.projectForm = FormsHelper.initProjectForm();
    this.sprintsForm = FormsHelper.initSprintsForm();
    this.epicsForm = FormsHelper.initEpicsForm();
    this.issuesForm = FormsHelper.initIssuesForm();
    this.mainForm = FormsHelper.initMainForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
