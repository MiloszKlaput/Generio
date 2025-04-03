import { Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ProcessDataService } from '../../../services/process-data.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, Location } from '@angular/common';
import { ProcessStateService } from '../../../services/process-state.service';
import { ProcessState } from '../../../enums/process-state.enum';

@Component({
  selector: 'process-error',
  imports: [
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    CommonModule
  ],
  templateUrl: './process-error.component.html',
  styleUrl: './process-error.component.scss'
})
export class ProcessErrorComponent implements OnDestroy {
  private processDataService = inject(ProcessDataService);
  private processStateService = inject(ProcessStateService);
  errorMessage$ = this.processDataService.errorMessage$;

  startOver(): void {
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.processStateService.setProcessState(ProcessState.New);
  }
}
