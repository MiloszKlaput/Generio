import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ProcessDataService } from '../../../services/process-data.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

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
export class ProcessErrorComponent {
  private processDataService = inject(ProcessDataService);
  private router = inject(Router);
  errorMessage$ = this.processDataService.errorMessage$;

  startOver(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/Form'])
      });
  }
}
