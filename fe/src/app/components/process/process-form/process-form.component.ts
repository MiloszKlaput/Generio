import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProcessFormControls } from '../../../types/process-form-controls.type';
import { CommonModule } from '@angular/common';
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
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    TranslateModule
  ],
  templateUrl: './process-form.component.html',
  styleUrls: ['./process-form.component.scss'],
  standalone: true
})
export class ProcessFormComponent implements OnInit {
  private populateProcessService = inject(JiraPopulateProcessService);
  form!: FormGroup<ProcessFormControls>;

  get f(): ProcessFormControls { return this.form.controls; }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    this.populateProcessService.startProcess(
      this.f.jiraLogin.value!,
      this.f.jiraUserId.value!,
      this.f.jiraApiKey.value!,
      this.f.jiraUserJiraUrl.value!,
      this.f.geminiApiKey.value!,
      this.f.geminiMessage.value!
    );
  }

  onBlur(control: AbstractControl): void {
    if (control && typeof control.value === 'string') {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }

  private initForm(): void {
    this.form = new FormGroup<ProcessFormControls>({
      jiraLogin: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
      jiraUserId: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
      jiraApiKey: new FormControl<string>('', [Validators.required, Validators.maxLength(300)]),
      jiraUserJiraUrl: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
      geminiApiKey: new FormControl<string>('', [Validators.required, Validators.maxLength(300)]),
      geminiMessage: new FormControl<string>('', [Validators.required, Validators.maxLength(500)]),
    });
  }
}
