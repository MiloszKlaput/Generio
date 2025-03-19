import { inject, Injectable } from '@angular/core';
import { JiraApiService } from './jira-api.service';
import { RequestBuilder } from '../logic/request-builder.logic';
import { ProjectRequest, ProjectResponse } from '../models/project/project.model';
import { SprintRequest, SprintResponse } from '../models/sprint/sprint.model';
import { MoveToEpicRequest } from '../models/issue/move-to-epic.model';
import { MoveToSprintRequest } from '../models/issue/move-to-sprint.model';
import { MainFormControls } from '../types/main-form-controls.type';
import { from, mergeMap, toArray, tap, Observable, catchError, throwError, of, concatMap } from 'rxjs';
import { BoardIdResponse } from '../models/board/board.model';
import { WorkflowSimulator } from '../logic/workflow-simulator.logic';
import { FileHelper } from '../helpers/file.helper';
import { IssueRequest, IssueResponse, Issue } from '../models/issue/issue.model';
import { ProcessStateService } from './process-state.service';
import { ProcessState } from '../enums/process-state.enum';
import { ProcessDataService } from './process-data.service';


@Injectable({
  providedIn: 'root'
})
export class JiraPopulateProcessService {
  private apiService = inject(JiraApiService);
  private processStateService = inject(ProcessStateService);
  private processDataService = inject(ProcessDataService);
  private issues: Issue[] = [];

  startProcess(mainFormData: MainFormControls): void {
    this.processStateService.setProcessState(ProcessState.InProgress);

    this.processDataService.initRequestData(mainFormData);
    this.processDataService.initResponseData();

    this.createNewProject(mainFormData)
      .pipe(
        concatMap(() => this.getBoardId()),
        concatMap(() => this.deleteSprintZero()),
        concatMap(() => this.createSprints(mainFormData)),
        concatMap(() => this.createEpics(mainFormData)),
        concatMap(() => this.createIssues(mainFormData)),
        concatMap(() => this.moveIssuesToEpics()),
        concatMap(() => this.simulateBusinessWorkflow()),
        concatMap(() => this.moveIssuesToSprints())
      )
      .subscribe({
        next: () => {
          this.createImportFile();
          this.processStateService.setProcessState(ProcessState.Success);
        },
        error: (err) => {
          this.handleError(err);
        }
      });
  }

  clearData(): void {
    this.apiService.deleteProject(this.processDataService.requestData.projectKey).subscribe();
  }

  private handleError(err: any) {
    this.setErrorMessage(err);
    this.processStateService.setProcessState(ProcessState.Error);
    if (!this.processDataService.responseData.projectKey) {
      return;
    }
    this.clearData();
  }

  private setErrorMessage(err: any): void {
    const errMsg = JSON.stringify(err.error, null, 2);
    const formatedErrMsgArr = errMsg.replace(/{|}|"/g, '').split(': ');
    const formatedErrMsg = formatedErrMsgArr[formatedErrMsgArr.length - 1];

    this.processDataService.errorMessage$.next(formatedErrMsg);
  }

  private createNewProject(data: MainFormControls): Observable<ProjectResponse> {
    const request: ProjectRequest = RequestBuilder.buildProjectRequest(data);
    this.processDataService.requestData.projectDescription = request.description;
    this.processDataService.requestData.projectName = request.name;
    this.processDataService.requestData.projectKey = request.key;

    return this.apiService.createProject(request).pipe(
      tap((result: ProjectResponse) => {
        if (result) {
          this.processDataService.responseData.projectId = result.data.id;
          this.processDataService.responseData.projectLink = result.data.self;
          this.processDataService.responseData.projectKey = result.data.key;
        }
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  private getBoardId(): Observable<BoardIdResponse> {
    const projectKey = this.processDataService.requestData.projectKey;
    return this.apiService.getBoardId(projectKey).pipe(
      tap((result: BoardIdResponse) => {
        if (result) {
          this.processDataService.responseData.boardId = result.data;
        }
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  private deleteSprintZero(): Observable<any> {
    const boardId = this.processDataService.responseData.boardId;
    return this.apiService.deleteSprintZero(boardId).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  private createSprints(formData: MainFormControls): Observable<SprintResponse[]> {
    const sprints: SprintRequest[] = RequestBuilder.buildSprintsRequest(formData, this.processDataService.responseData.boardId);
    return from(sprints).pipe(
      mergeMap((sprint: SprintRequest) => this.apiService.createSprint(sprint)),
      toArray(),
      tap((result: SprintResponse[]) => {
        if (result) {
          this.processDataService.responseData.sprints = result;
        }
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  private createEpics(data: MainFormControls): Observable<{ issues: IssueResponse[], errors: any[] }> {
    const projectKey = this.processDataService.requestData.projectKey;
    const epics: IssueRequest[] = RequestBuilder.buildEpicsRequest(data, projectKey);
    return this.apiService.createIssues(epics).pipe(
      tap((result: { issues: IssueResponse[], errors: any[] }) => {
        if (result.issues) {
          for (const epic of result.issues) {
            this.processDataService.responseData.epicsIds.push(epic.id);
          }
        }
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  private createIssues(data: MainFormControls): Observable<{ issues: IssueResponse[], errors: any[] }> {
    const projectKey = this.processDataService.requestData.projectKey;
    const issuesRequest: IssueRequest[] = RequestBuilder.buildIssuesRequest(data, projectKey);
    this.processDataService.requestData.issues = issuesRequest;

    return this.apiService.createIssues(issuesRequest).pipe(
      tap((result: { issues: IssueResponse[], errors: any[] }) => {
        if (result.issues) {
          this.processDataService.responseData.issues = result.issues;
          this.issues = this.processDataService.mergeIssues();
        }
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  private moveIssuesToEpics(): Observable<any> {
    const requests: MoveToEpicRequest[] = RequestBuilder.buildMoveToEpicRequest(this.processDataService.responseData.epicsIds, this.issues);

    return from(requests).pipe(
      mergeMap((req: MoveToEpicRequest) => this.apiService.moveIssuesToEpic(req)),
      toArray(),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  private moveIssuesToSprints(): Observable<any> {
    const requests: MoveToSprintRequest[] = RequestBuilder.buildMoveToSprintRequest(this.processDataService.requestData.sprintIssuesAssigment!);

    return from(requests).pipe(
      mergeMap((req: MoveToSprintRequest) => this.apiService.moveIssuesToSprint(req)),
      toArray(),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  private simulateBusinessWorkflow(): Observable<{ [key: string]: { sprintId: number, issues: Issue[] } }> {
    const sprintsAssigments = WorkflowSimulator.simulateBusinessWorkflow(this.processDataService.requestData, this.processDataService.responseData, this.issues);
    this.processDataService.requestData.sprintIssuesAssigment = sprintsAssigments;

    return of(sprintsAssigments);
  }

  private createImportFile(): void {
    const fileData = FileHelper.createFileData(this.processDataService.requestData, this.issues);
    this.processDataService.fileData$.next(fileData);
  }
}
