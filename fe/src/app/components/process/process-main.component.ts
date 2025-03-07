import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProcessFormComponent } from './process-form/process-form.component';
import { ProcessStateService } from '../../services/process-state.service';
import { ProcessState } from '../../enums/process-state.enum';
import { ProcessErrorComponent } from './process-error/process-error.component';
import { ProcessInProgressComponent } from './process-in-progress/process-in-progress.component';
import { ProcessSuccessComponent } from './process-success/process-success.component';
import { Subject, takeUntil } from 'rxjs';

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
export class ProcessMainComponent implements OnInit, OnDestroy {
  private processStateService = inject(ProcessStateService);
  private destroyed$ = new Subject<void>();
  state = ProcessState.New;

  ProcessState = ProcessState;

  ngOnInit(): void {
    this.processStateService.getProcessState()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((s: ProcessState) => this.state = s);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
