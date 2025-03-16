import { Component, inject } from '@angular/core';
import { ProcessFormComponent } from './process-form/process-form.component';
import { ProcessStateService } from '../../services/process-state.service';
import { ProcessState } from '../../enums/process-state.enum';
import { ProcessErrorComponent } from './process-error/process-error.component';
import { ProcessInProgressComponent } from './process-in-progress/process-in-progress.component';
import { ProcessSuccessComponent } from './process-success/process-success.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'process-main',
  imports: [
    ProcessFormComponent,
    ProcessErrorComponent,
    ProcessInProgressComponent,
    ProcessSuccessComponent,
    CommonModule
  ],
  templateUrl: './process-main.component.html',
  standalone: true
})
export class ProcessMainComponent {
  private processStateService = inject(ProcessStateService);
  state$ = this.processStateService.getProcessState();
  ProcessState = ProcessState;
}
