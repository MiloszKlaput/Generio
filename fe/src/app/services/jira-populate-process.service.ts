import { inject, Injectable } from '@angular/core';
import { JiraApiService } from './jira-api.service';
import { RequestBuilder } from '../logic/request-builder.logic';
import { ProjectRequest, ProjectResponse } from '../models/project/project.model';
import { SprintRequest, SprintResponse } from '../models/sprint/sprint.model';
import { MoveToEpicRequest } from '../models/issue/move-to-epic.model';
import { MoveToSprintRequest } from '../models/issue/move-to-sprint.model';
import { MainFormControls } from '../types/main-form-controls.type';
import { IsProjectNeeded } from '../enums/is-project-needed.enum';
import { RequestData, ResponseData } from '../models/process/process-data.model';
import { DateTime } from 'luxon';
import { from, switchMap, concatMap, toArray, tap, Observable, catchError, throwError, BehaviorSubject, of } from 'rxjs';
import { BoardIdResponse } from '../models/board/board.model';
import { WorkflowSimulator } from '../logic/workflow-simulator.logic';
import { FileDataHelper } from '../helpers/file-data.helper';
import { IssueRequest, IssueResponse, Issue } from '../models/issue/issue.model';
import { FileData } from '../models/process/file-data.model';


@Injectable({
  providedIn: 'root'
})
export class JiraPopulateProcessService {
  private apiService = inject(JiraApiService);
  private requestData!: RequestData;
  private responseData!: ResponseData;
  private issues: Issue[] = [];
  isInProgress$ = new BehaviorSubject<boolean>(false);
  isSubmitted$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);

  startProcess(mainFormData: MainFormControls): void {
    this.isInProgress$.next(true);

    this.initRequestData(mainFormData);
    this.initResponseData();

    this.createNewProject(mainFormData)
      .pipe(
        switchMap(() => this.getBoardId()),
        switchMap(() => this.createSprints()),
        switchMap(() => this.createEpics()),
        switchMap(() => this.createIssues()),
        switchMap(() => this.moveIssuesToEpics()),
        switchMap(() => this.moveIssuesToSprints())
      )
      .subscribe({
        next: () => {
          if (this.requestData.projectStartDate < DateTime.now())
            this.createPastProjectDataFile();
        },
        error: (err) => {
          console.error(err);
          this.handleError('Server error');
        }
      });
  }

  clearError(): void {
    this.error$.next(null);
  }

  private setError(msg: string): void {
    this.error$.next(msg);
  }

  private handleError(msg: string): void {
    this.setError(msg);
    this.clearData();
    this.resetProcessStatus();
  }

  private clearData(): void {
    this.apiService.deleteProject(this.requestData.projectKey).subscribe();
  }

  private resetProcessStatus(): void {
    this.isInProgress$.next(false);
  }

  private createNewProject(data: MainFormControls): Observable<ProjectResponse> {
    const request: ProjectRequest = RequestBuilder.buildProjectRequest(data);
    this.requestData.projectDescription = request.description;
    this.requestData.projectName = request.name;
    this.requestData.projectKey = request.key;

    return this.apiService.createProject(request).pipe(
      tap((result: ProjectResponse) => {
        if (result) {
          this.responseData.projectId = result.data.id;
          this.responseData.projectLink = result.data.self;
          this.responseData.projectKey = result.data.key;
        }
      }),
      catchError((err) => {
        console.error('Error creating project', err);
        return throwError(() => err);
      })
    );
  }

  private getBoardId(): Observable<BoardIdResponse> {
    const projectKey = this.requestData.projectKey;
    return this.apiService.getBoardId(projectKey).pipe(
      tap((result: BoardIdResponse) => {
        if (result) {
          this.responseData.boardId = result.data;
        }
      }),
      catchError((err) => {
        this.handleError('Server error');
        return throwError(() => err);
      })
    );
  }

  private createSprints(): Observable<SprintResponse[]> {
    const sprints: SprintRequest[] = RequestBuilder.buildSprintsRequest(
      this.requestData.sprintsCount,
      this.requestData.sprintDuration,
      this.requestData.projectStartDate,
      this.responseData.boardId
    );
    return from(sprints).pipe(
      concatMap((sprint: SprintRequest) => this.apiService.createSprint(sprint)),
      toArray(),
      tap((result: SprintResponse[]) => {
        if (result) {
          this.responseData.sprints = result;
        }
      }),
      catchError((err) => {
        console.error('Error creating sprints', err);
        return throwError(() => err);
      })
    );
  }

  private createEpics(): Observable<{ issues: IssueResponse[], errors: any[] }> {
    const epicsCount = this.requestData.epicsCount;
    const projectKey = this.requestData.projectKey;
    const epics: IssueRequest[] = RequestBuilder.buildEpicsRequest(epicsCount, projectKey);

    return this.apiService.createIssues(epics).pipe(
      tap((result: { issues: IssueResponse[], errors: any[] }) => {
        if (result.issues) {
          for (const epic of result.issues) {
            this.responseData.epicsIds.push(epic.id);
          }
        }
      }),
      catchError((err) => {
        console.error('Error creating epics', err);
        return throwError(() => err);
      })
    );
  }

  private createIssues(): Observable<{ issues: IssueResponse[], errors: any[] }> {
    const issuesCount = this.requestData.issuesCount;
    const projectKey = this.requestData.projectKey;
    const issuesRequest: IssueRequest[] = RequestBuilder.buildIssuesRequest(issuesCount, projectKey);
    this.requestData.issues = issuesRequest;

    return this.apiService.createIssues(issuesRequest).pipe(
      tap((result: { issues: IssueResponse[], errors: any[] }) => {
        if (result.issues) {
          this.responseData.issues = result.issues;
          this.issues = this.mergeIssues();
        }
      }),
      catchError((err) => {
        console.error('Error creating issues', err);
        return throwError(() => err);
      })
    );
  }

  private moveIssuesToEpics(): Observable<any> {
    const requests: MoveToEpicRequest[] = RequestBuilder.buildMoveToEpicRequest(this.responseData.epicsIds, this.issues);

    return from(requests).pipe(
      concatMap((req: MoveToEpicRequest) => this.apiService.moveIssuesToEpic(req)),
      toArray(),
      catchError((err) => {
        console.error('Error linking issues to epics', err);
        return throwError(() => err);
      })
    );
  }

  private moveIssuesToSprints(): Observable<any> {
    const sprintsIds = this.responseData.sprints.map((s) => s.data.id);
    const requests: MoveToSprintRequest[] = RequestBuilder.buildMoveToSprintRequest(sprintsIds, this.issues);
    this.requestData.sprintIssuesAssigment = requests;

    return from(requests).pipe(
      concatMap((req: MoveToSprintRequest) => this.apiService.moveIssuesToSprint(req)),
      toArray(),
      catchError((err) => {
        console.error('Error linking issues to sprints', err);
        return throwError(() => err);
      })
    );
  }

  private createPastProjectDataFile(): void {
    WorkflowSimulator.simulateWorkflowForAllSprints(this.requestData, this.responseData, this.issues);
    const fileData = FileDataHelper.generateFileData(this.requestData, this.issues);
    this.saveToFile(fileData);

    this.isInProgress$.next(false);
    this.isSubmitted$.next(true);
  }

  private mergeIssues(): Issue[] {
    return this.responseData.issues.map((issueResponse, index) => {
      const issueRequest = this.requestData.issues[index];

      return {
        id: issueResponse.id,
        key: issueResponse.key,
        self: issueResponse.self,
        fields: issueRequest.fields
      } as Issue;
    });
  }

  private initRequestData(formData: MainFormControls): void {
    this.requestData = {
      projectName: formData.projectName.value!,
      projectDescription: formData.projectDescription.value!,
      projectKey: formData.projectKey.value!,
      atlassianId: formData.atlassianId.value!,
      sprintsCount: formData.sprintsCount.value!,
      sprintDuration: formData.sprintDuration.value!,
      projectStartDate: DateTime.fromJSDate(formData.projectStartDate.value!),
      epicsCount: formData.epicsCount.value!,
      issuesCount: formData.issuesCount.value!,
      issuesTypes: {
        story: formData.issuesTypes.value.story!,
        bug: formData.issuesTypes.value.bug!,
        task: formData.issuesTypes.value.task!
      },
      sprintIssuesAssigment: [],
      issues: []
    };
  }

  private initResponseData(): void {
    this.responseData = {
      projectId: '',
      projectLink: '',
      projectKey: '',
      boardId: 0,
      sprints: [],
      epicsIds: [],
      issues: []
    };
  }

  private saveToFile(fileData: FileData): void {
    const jsonData = JSON.stringify(fileData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'jiraProjectImport.json';
    link.click();

    URL.revokeObjectURL(url);
  }
}
