import { Component, DestroyRef, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProcessDataService } from '../../../services/process-data.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FileHelper } from '../../../helpers/file.helper';
import { FileData } from '../../../models/process/file-data.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProcessStateService } from '../../../services/process-state.service';
import { ProcessState } from '../../../enums/process-state.enum';

@Component({
  selector: 'process-success',
  imports: [MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './process-success.component.html',
  styleUrl: './process-success.component.scss'
})
export class ProcessSuccessComponent implements OnDestroy {
  private processDataService = inject(ProcessDataService);
  private processStateService = inject(ProcessStateService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  isFileCreated: boolean = false;
  fileData$ = this.processDataService.fileData$;

  openProject(): void {
    window.open(this.getUrl(), '_blank');
    this.router.navigateByUrl('/');
  }

  onSaveFile(): void {
    this.fileData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((fileData: FileData | null) => {
        if (fileData) {
          FileHelper.saveToFile(fileData)
        }
      });
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
