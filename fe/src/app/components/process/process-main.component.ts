import { Component, inject, OnInit } from '@angular/core';
import { ProcessFormComponent } from './process-form/process-form.component';
import { ProcessStateService } from '../../services/process-state.service';
import { ProcessState } from '../../enums/process-state.enum';
import { ProcessErrorComponent } from './process-error/process-error.component';
import { ProcessInProgressComponent } from './process-in-progress/process-in-progress.component';
import { ProcessSuccessComponent } from './process-success/process-success.component';

@Component({
  selector: 'process-main',
  imports: [
    ProcessFormComponent,
    ProcessErrorComponent,
    ProcessInProgressComponent,
    ProcessSuccessComponent
  ],
  templateUrl: './process-main.component.html',
  standalone: true
})
export class ProcessMainComponent implements OnInit {
  private processStateService = inject(ProcessStateService)
  state = ProcessState.New;

  ProcessState = ProcessState;

  ngOnInit(): void {
    this.processStateService.getProcessState()
      .subscribe((s: ProcessState) => this.state = s);
  }
}
