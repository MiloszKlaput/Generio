import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProcessStateService } from '../../../services/process-state.service';
import { ProcessState } from '../../../enums/process-state.enum';
import { Router } from '@angular/router';
import { ProcessDataService } from '../../../services/process-data.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'process-error',
  imports: [MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './process-error.component.html',
  styleUrl: './process-error.component.scss'
})
export class ProcessErrorComponent implements OnInit, OnDestroy {
  private processStateService = inject(ProcessStateService);
  private processDataService = inject(ProcessDataService);
  private router = inject(Router);
  errorMessage: string = '';

  ngOnInit(): void {
    this.processDataService.errorMessage$
      .subscribe((errMsg: string | null) => {
        if (errMsg) {
          this.errorMessage = errMsg
        }
      });
  }

  startOver(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/Form'])
      });
  }

  ngOnDestroy(): void {
    this.processStateService.setProcessState(ProcessState.New);
  }
}
