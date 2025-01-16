import { Component, inject, type OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
export class JiraFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;

  get f(): any {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      isProjectNeeded: ['no', [Validators.required]],
      existingProjectKey: [''],
      projectName: [''],
      projectDescription: [''],
      projectKey: [''],
      atlassianId: [''],
      sprintsCount: [0, [Validators.required, Validators.min(0)]],
      sprintDuration: [1, [Validators.required, Validators.min(1)]],
      projectStartDate: [new Date(Date.now()), [Validators.required]],
      isEpicNeeded: ['no', [Validators.required]],
      EpicsCount: [0, [Validators.min(0)]],
      IssuesCount: [0, [Validators.required, Validators.min(0)]],
      issuesTypes: this.fb.group({
        story: [true, [Validators.required]],
        bug: [false, [Validators.required]],
        task: [false, [Validators.required]]
      })
    });
  }

  onSubmit(): void {
    console.log(this.form.value);
  }
}
