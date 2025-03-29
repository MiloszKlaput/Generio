import { Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProcessDataService } from '../../../services/process-data.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessStateService } from '../../../services/process-state.service';
import { ProcessState } from '../../../enums/process-state.enum';

@Component({
  selector: 'process-success',
  imports: [
    MatIconModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './process-success.component.html',
  styleUrl: './process-success.component.scss'
})
export class ProcessSuccessComponent implements OnDestroy {
  private processDataService = inject(ProcessDataService);
  private processStateService = inject(ProcessStateService);
  private router = inject(Router);
  isFileCreated: boolean = false;

  openProject(): void {
    window.open(this.getUrl(), '_blank');
    this.router.navigateByUrl('/');
  }

  private getUrl(): string {
    const { atlassianUserJiraUrl, projectKey, boardId } = this.processDataService.processData$.getValue()!;

    return `https://${atlassianUserJiraUrl}/jira/software/c/projects/${projectKey}/boards/${boardId}/backlog`;
  }

  ngOnDestroy(): void {
    this.processStateService.setProcessState(ProcessState.New);
  }
}
