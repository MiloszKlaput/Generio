import { Component, inject, ViewChild, type OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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
import { map } from 'rxjs';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatGridListModule } from '@angular/material/grid-list';
import { EpicsFormControls, IssuesFormControls, MainFormControls, ProjectFormControls, SprintsFormControls, UserInfoFormControls } from '../../../types/main-form-controls.type';
import { FormsHelper } from '../../../helpers/forms.helper';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatRadioModule } from '@angular/material/radio';
import { JiraPopulateProcessService } from '../../../services/jira-populate-process.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'process-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
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
export class ProcessFormComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private populateProcessService = inject(JiraPopulateProcessService);
  @ViewChild('stepper') stepper!: MatStepper;
  userInfoForm!: FormGroup<UserInfoFormControls>;
  projectForm!: FormGroup<ProjectFormControls>;
  sprintsForm!: FormGroup<SprintsFormControls>;
  epicsForm!: FormGroup<EpicsFormControls>;
  issuesForm!: FormGroup<IssuesFormControls>;
  mainForm!: FormGroup<MainFormControls>;

  stepperOrientation$ = this.breakpointObserver.observe('(min-width: 960px)')
    .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

  get fu(): UserInfoFormControls { return this.userInfoForm.controls; }
  get fp(): ProjectFormControls { return this.projectForm.controls; }
  get fs(): SprintsFormControls { return this.sprintsForm.controls; }
  get fe(): EpicsFormControls { return this.epicsForm.controls; }
  get fi(): IssuesFormControls { return this.issuesForm.controls; }
  get fM(): MainFormControls { return this.mainForm.controls; }

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
    FormsHelper.mapToMainForm(
      this.userInfoForm,
      this.projectForm,
      this.sprintsForm,
      this.epicsForm,
      this.issuesForm,
      this.mainForm
    );

    this.populateProcessService.startProcess(this.fM);
  }

  private initForms(): void {
    this.userInfoForm = FormsHelper.initUserInfoForm();
    this.projectForm = FormsHelper.initProjectForm();
    this.sprintsForm = FormsHelper.initSprintsForm();
    this.epicsForm = FormsHelper.initEpicsForm();
    this.issuesForm = FormsHelper.initIssuesForm();
    this.mainForm = FormsHelper.initMainForm();
  }
}
