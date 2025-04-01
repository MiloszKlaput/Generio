import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JiraApiService } from './jira-api.service';
// import { RequestBuilder } from '../logic/request-builder.logic';
import { Project } from '../models/generio/project/project.model';
import { Sprint } from '../models/generio/sprint/sprint.model';
import { MoveToEpicRequest } from '../models/generio/move/move-to-epic.model';
import { MoveToSprintRequest } from '../models/generio/move/move-to-sprint.model';
import { from, mergeMap, toArray, tap, Observable, catchError, throwError, concatMap, map } from 'rxjs';
import { Board } from '../models/generio/board/board.model';
import { Issue } from '../models/generio/issue/issue.model';
import { ProcessStateService } from './process-state.service';
import { ProcessState } from '../enums/process-state.enum';
import { ProcessDataService } from './process-data.service';
import { ProcessData } from '../models/generio/process/process-data.model';
import { GeminiService } from './gemini.service';

@Injectable({
  providedIn: 'root'
})
export class JiraPopulateProcessService {
  private jiraApiService = inject(JiraApiService);
  private geminiService = inject(GeminiService);
  private processStateService = inject(ProcessStateService);
  private processDataService = inject(ProcessDataService);
  private destroyRef = inject(DestroyRef);

  startProcess(
    // jiraLogin: string,
    // jiraUserId: string,
    // jiraApiKey: string,
    // jiraUserJiraUrl: string,
    geminiApiKey: string,
    geminiMessage: string): void {
    this.processStateService.setProcessState(ProcessState.InProgress);
    this.processDataService.initProcessData();
    // this.updateProcessData({
    //   jiraLogin,
    //   jiraUserId,
    //   jiraApiKey,
    //   jiraUserJiraUrl
    // });

    this.geminiService.generateContent(geminiMessage, geminiApiKey)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        if (res) {
          this.handleGeminiResponse(res);
          this.processStateService.setProcessState(ProcessState.New);
        }
      });

    // this.createNewProject()
    //   .pipe(
    //     concatMap(() => this.getBoardId()),
    //     concatMap(() => this.deleteSprintZero()),
    //     concatMap(() => this.createSprints()),
    //     concatMap(() => this.createEpics()),
    //     concatMap(() => this.createIssues()),
    //     concatMap(() => this.moveIssuesToEpics()),
    //     concatMap(() => this.moveIssuesToSprints()),
    //   )
    //   .subscribe({
    //     next: () => {
    //       this.processStateService.setProcessState(ProcessState.Success);
    //     },
    //     error: (err) => {
    //       this.handleError(err);
    //     }
    //   });
  }

  clearData(): void {
    this.jiraApiService.deleteProject(this.processDataService.processData$.getValue()!.project?.key!).subscribe();
  }

  private handleError(err: any) {
    this.setErrorMessage(err);
    this.processStateService.setProcessState(ProcessState.Error);
    if (!this.processDataService.processData$.getValue()!.project?.key) {
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

  // private createNewProject(): Observable<ProjectResponse> {
  //   const { projectDescription, projectKey, jiraUserId, projectName } = this.processDataService.processData$.getValue()!;
  //   const request: ProjectRequest = RequestBu ilder.buildProjectRequest(projectDescription, projectKey, jiraUserId, projectName);

  //   this.updateProcessData({
  //     projectDescription: request.description,
  //     projectName: request.name,
  //     projectKey: request.key
  //   });

  //   return this.apiService.createProject(request).pipe(
  //     tap((result: ProjectResponse) => {
  //       if (result) {
  //         this.updateProcessData({
  //           projectId: result.data.id,
  //           projectLink: result.data.self,
  //           projectKey: result.data.key
  //         });
  //       }
  //     })
  //   );
  // }

  // private getBoardId(): Observable<BoardIdResponse> {
  //   const projectKey = this.processDataService.processData$.getValue()!.projectKey;

  //   return this.apiService.getBoardId(projectKey).pipe(
  //     tap((result: BoardIdResponse) => {
  //       if (result) {
  //         this.updateProcessData({ boardId: result.data });
  //       }
  //     })
  //   );
  // }

  // private deleteSprintZero(): Observable<any> {
  //   const boardId = this.processDataService.processData$.getValue()!.boardId;

  //   return this.apiService.deleteSprintZero(boardId);
  // }

  // private createSprints(): Observable<SprintResponse[]> {
  //   const { boardId, sprintsCount, sprintDuration, projectStartDate } = this.processDataService.processData$.getValue()!
  //   const sprints: SprintRequest[] = RequestBuilder.buildSprintsRequest(boardId, sprintsCount, sprintDuration, projectStartDate);

  //   return from(sprints).pipe(
  //     concatMap((sprint: SprintRequest) => this.apiService.createSprint(sprint)),
  //     toArray(),
  //     tap((result: SprintResponse[]) => {
  //       if (result) {
  //         this.updateProcessData({ sprints: result });
  //       }
  //     })
  //   );
  // }

  // private createEpics(): Observable<{ issues: IssueResponse[], errors: any[] }> {
  //   const epics: IssueRequest[] = RequestBuilder.buildEpicsRequest();

  //   return this.apiService.createIssues(epics).pipe(
  //     tap((result: { issues: IssueResponse[], errors: any[] }) => {
  //       if (result.issues) {
  //         const epicIds: number[] = [];
  //         for (const epic of result.issues) {
  //           epicIds.push(epic.id);
  //         }
  //         this.updateProcessData({ epicsIds: epicIds });
  //       }
  //     })
  //   );
  // }

  // private createIssues(): Observable<any> {
  //   const issuesRequest: IssueRequest[][] = RequestBuilder.buildIssuesRequest();

  //   return from(issuesRequest).pipe(
  //     concatMap((req: IssueRequest[]) => this.apiService.createIssues(req).pipe(
  //       map((result: { issues: IssueResponse[], errors: any[] }) => {

  //         const mergedIssues: Issue[] = result.issues.map((issueRes, index) => ({
  //           ...issueRes,
  //           fields: req[index]?.fields
  //         }));

  //         this.updateProcessData({ issues: mergedIssues });

  //         return mergedIssues;
  //       })
  //     )),
  //     toArray()
  //   );
  // }

  // private moveIssuesToEpics(): Observable<any> {
  //   const requests: MoveToEpicRequest[] = RequestBuilder.buildMoveToEpicRequest();

  //   return from(requests).pipe(
  //     mergeMap((req: MoveToEpicRequest) => this.apiService.moveIssuesToEpic(req)),
  //     toArray(),
  //     catchError((err) => {
  //       return throwError(() => err);
  //     })
  //   );
  // }

  // private moveIssuesToSprints(): Observable<any> {
  //   const requests: MoveToSprintRequest[] = RequestBuilder.buildMoveToSprintRequest();

  //   return from(requests).pipe(
  //     mergeMap((req: MoveToSprintRequest) => this.apiService.moveIssuesToSprint(req)),
  //     toArray(),
  //     catchError((err) => {
  //       return throwError(() => err);
  //     })
  //   );
  // }

  private updateProcessData(partialData: Partial<ProcessData>): void {
    const currentApiData = this.processDataService.processData$.getValue()!;
    this.processDataService.processData$.next({ ...currentApiData, ...partialData });
  }

  private handleGeminiResponse(res: string): void {
    const cleanedResponse = res.replace(/```json\s*|\s*```/g, ''); // taki format zwraca Gemini
    const json = JSON.parse(cleanedResponse);
    console.log(json);

    this.updateProcessData({
      project: json.project,
      epics: json.epics,
      issues: json.issues,
      sprints: json.sprints
    });

    console.log(this.processDataService.processData$.getValue());
  }
}
