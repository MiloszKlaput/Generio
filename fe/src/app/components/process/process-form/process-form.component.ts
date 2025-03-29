import { Component, inject, ViewChild, type OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { map } from 'rxjs';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ProcessFormControls } from '../../../types/user-info-form-controls.type';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatRadioModule } from '@angular/material/radio';
import { JiraPopulateProcessService } from '../../../services/jira-populate-process.service';
import { TranslateModule } from '@ngx-translate/core';
import { whitespaceValidator } from '../../../validators/whitespace.validator';

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
    MatNativeDateModule,
    MatStepperModule,
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
  form!: FormGroup<ProcessFormControls>;

  stepperOrientation$ = this.breakpointObserver.observe('(min-width: 960px)')
    .pipe(
      map(({ matches }) => (matches ? 'horizontal' : 'vertical'))
    );

  get f(): ProcessFormControls { return this.form.controls; }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    this.populateProcessService.startProcess(
      this.f.atlassianLogin.value!,
      this.f.atlassianUserId.value!,
      this.f.atlassianApiKey.value!,
      this.f.atlassianUserJiraUrl.value!);
  }

  onBlur(control: AbstractControl): void {
    if (control && typeof control.value === 'string') {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }

  onReset(): void {
    this.initForm();
    this.stepper.reset();
  }

  private initForm(): void {
    this.form = new FormGroup<ProcessFormControls>({
      atlassianLogin: new FormControl<string>('', [Validators.required, whitespaceValidator()]),
      atlassianUserId: new FormControl<string>('', [Validators.required, whitespaceValidator()]),
      atlassianApiKey: new FormControl<string>('', [Validators.required, whitespaceValidator()]),
      atlassianUserJiraUrl: new FormControl<string>('', [Validators.required, whitespaceValidator()])
    });
  }
}
