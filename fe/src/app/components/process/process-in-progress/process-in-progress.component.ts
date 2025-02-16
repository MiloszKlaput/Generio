import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'process-in-progress',
  imports: [MatProgressBarModule, MatIconModule],
  templateUrl: './process-in-progress.component.html',
  styleUrl: './process-in-progress.component.scss',
  standalone: true
})
export class ProcessInProgressComponent {

}
