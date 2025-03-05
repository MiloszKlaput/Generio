import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProcessStateService } from '../../../services/process-state.service';
import { ProcessState } from '../../../enums/process-state.enum';
import { ProcessDataService } from '../../../services/process-data.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'process-success',
  imports: [MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './process-success.component.html',
  styleUrl: './process-success.component.scss'
})
export class ProcessSuccessComponent {
  private processStateService = inject(ProcessStateService);
  private processDataService = inject(ProcessDataService);
  private router = inject(Router);

  openProject(): void {
    window.open(this.getUrl(), '_blank');
    this.router.navigateByUrl('/');
  }

  private getUrl(): string {
    const baseUrl = this.processDataService.responseData.projectLink.split('/').find(i => i.includes('atlassian.net'));
    const projectKey = this.processDataService.responseData.projectKey;
    const boardId = this.processDataService.responseData.boardId;

    return `https://${baseUrl}/jira/software/c/projects/${projectKey}/boards/${boardId}/backlog`;
  }

  ngOnDestroy(): void {
    this.processStateService.setProcessState(ProcessState.New);
  }
}
