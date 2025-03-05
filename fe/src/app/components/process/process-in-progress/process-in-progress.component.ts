import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'process-in-progress',
  imports: [MatProgressBarModule, MatIconModule, TranslateModule],
  templateUrl: './process-in-progress.component.html',
  styleUrl: './process-in-progress.component.scss',
  standalone: true
})
export class ProcessInProgressComponent {

}
