import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProcessStateService } from '../../../services/process-state.service';
import { ProcessState } from '../../../enums/process-state.enum';
import { ProcessDataService } from '../../../services/process-data.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { FileHelper } from '../../../helpers/file.helper';

@Component({
  selector: 'process-success',
  imports: [MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './process-success.component.html',
  styleUrl: './process-success.component.scss'
})
export class ProcessSuccessComponent implements OnInit {
  private processStateService = inject(ProcessStateService);
  private processDataService = inject(ProcessDataService);
  private router = inject(Router);
  private destroyed$ = new Subject<void>();
  isFileCreated: boolean = false;
  fileData: string = "";

  ngOnInit(): void {
    this.processDataService.fileData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(fileData => {
        if (fileData) {
          this.fileData = fileData;
          this.isFileCreated = fileData?.length > 0;
        }
      });
  }

  openProject(): void {
    window.open(this.getUrl(), '_blank');
    this.router.navigateByUrl('/');
  }

  onSaveFile(): void {
    FileHelper.saveToFile(this.fileData);
  }

  private getUrl(): string {
    const baseUrl = this.processDataService.responseData.projectLink.split('/').find(i => i.includes('atlassian.net'));
    const projectKey = this.processDataService.responseData.projectKey;
    const boardId = this.processDataService.responseData.boardId;

    return `https://${baseUrl}/jira/software/c/projects/${projectKey}/boards/${boardId}/backlog`;
  }

  ngOnDestroy(): void {
    this.processStateService.setProcessState(ProcessState.New);
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
