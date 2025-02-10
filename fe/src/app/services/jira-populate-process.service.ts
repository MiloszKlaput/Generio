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
import { from, switchMap, concatMap, toArray, tap, Observable, catchError, throwError, BehaviorSubject } from 'rxjs';
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

  startProcess(mainFormData: MainFormControls): void {
    this.isInProgress$.next(true);

    this.initRequestData(mainFormData);
    this.initResponseData();

    if (this.requestData.isProjectNeeded === IsProjectNeeded.Yes) {
      this.createNewProject(mainFormData).subscribe({
        next: () => this.continueProcess(mainFormData),
        error: (err) => console.error(err)
      });
    } else {
      this.requestData.projectKey = mainFormData.existingProjectKey.value!;
      this.continueProcess(mainFormData);
    }
  }

  private continueProcess(data: MainFormControls): void {
    const projectKey = this.getProjectKey();

    this.getBoardId(projectKey)
      .pipe(
        switchMap(() => this.createSprints(data)),
        switchMap(() => this.createEpics(data)),
        switchMap(() => this.createIssues(data)),
        switchMap(() => this.moveIssuesToEpics()),
        switchMap(() => this.moveIssuesToSprints())
      )
      .subscribe({
        next: () => {
          if (this.requestData.projectStartDate < DateTime.now())
            this.createPastProjectDataFile();
        },
        error: (err) => console.error(err)
      });
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

  private getBoardId(projectKey: string): Observable<BoardIdResponse> {
    return this.apiService.getBoardId(projectKey).pipe(
      tap((result: BoardIdResponse) => {
        if (result) {
          this.responseData.boardId = result.data;
        }
      }),
      catchError((err) => {
        console.error('Error resolving board', err);
        return throwError(() => err);
      })
    );
  }

  private createSprints(data: MainFormControls): Observable<SprintResponse[]> {
    const sprints: SprintRequest[] = RequestBuilder.buildSprintsRequest(
      data,
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

  private createEpics(data: MainFormControls): Observable<{ issues: IssueResponse[], errors: any[] }> {
    const projectKey = this.getProjectKey();
    const epics: IssueRequest[] = RequestBuilder.buildEpicsRequest(data, projectKey);
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

  private createIssues(data: MainFormControls): Observable<{ issues: IssueResponse[], errors: any[] }> {
    const projectKey = this.getProjectKey();
    const issuesRequest: IssueRequest[] = RequestBuilder.buildIssuesRequest(data, projectKey);
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

  private getProjectKey(): string {
    return this.responseData?.projectKey
      ? this.responseData.projectKey
      : this.requestData.existingProjectKey;
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
      isProjectNeeded: formData.isProjectNeeded.value!,
      existingProjectKey: formData.existingProjectKey.value!,
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
