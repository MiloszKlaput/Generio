import { Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProcessStateService } from '../../../services/process-state.service';
import { ProcessState } from '../../../enums/process-state.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'process-error',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './process-error.component.html',
  styleUrl: './process-error.component.scss'
})
export class ProcessErrorComponent implements OnDestroy {
  private processStateService = inject(ProcessStateService);
  private router = inject(Router);

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
