import { inject, Injectable } from '@angular/core';
import { JiraApiService } from './jira-api.service';
// import { RequestBuilder } from '../logic/request-builder.logic';
import { ProjectRequest, ProjectResponse } from '../models/project/project.model';
import { SprintRequest, SprintResponse } from '../models/sprint/sprint.model';
import { MoveToEpicRequest } from '../models/issue/move-to-epic.model';
import { MoveToSprintRequest } from '../models/issue/move-to-sprint.model';
import { from, mergeMap, toArray, tap, Observable, catchError, throwError, concatMap, map } from 'rxjs';
import { BoardIdResponse } from '../models/board/board.model';
import { Issue, IssueRequest, IssueResponse } from '../models/issue/issue.model';
import { ProcessStateService } from './process-state.service';
import { ProcessState } from '../enums/process-state.enum';
import { ProcessDataService } from './process-data.service';
import { ProcessData } from '../models/process/process-data.model';
import { GeminiService } from './gemini.service';

@Injectable({
  providedIn: 'root'
})
export class JiraPopulateProcessService {
  private jiraApiService = inject(JiraApiService);
  private chatGptApiService = inject(GeminiService);
  private processStateService = inject(ProcessStateService);
  private processDataService = inject(ProcessDataService);

  startProcess(
    // atlassianLogin: string,
    // atlassianUserId: string,
    // atlassianApiKey: string,
    // atlassianUserJiraUrl: string,
    chatGptApiKey: string,
    chatGptMessage: string): void {
    this.processStateService.setProcessState(ProcessState.InProgress);
    this.processDataService.initProcessData();
    // this.updateProcessData({
    //   atlassianLogin,
    //   atlassianUserId,
    //   atlassianApiKey,
    //   atlassianUserJiraUrl
    // });

    this.chatGptApiService.generateContent(chatGptMessage, chatGptApiKey)
      .subscribe(res => {
        if (res) {
          const cleanedResponse = res.replace(/```json\s*|\s*```/g, '');
          const json = JSON.parse(cleanedResponse);
          console.log(json);
          this.updateProcessData({ geminiResponse: json });
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
    this.jiraApiService.deleteProject(this.processDataService.processData$.getValue()!.projectKey).subscribe();
  }

  private handleError(err: any) {
    this.setErrorMessage(err);
    this.processStateService.setProcessState(ProcessState.Error);
    if (!this.processDataService.processData$.getValue()!.projectKey) {
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
  //   const { projectDescription, projectKey, atlassianUserId, projectName } = this.processDataService.processData$.getValue()!;
  //   const request: ProjectRequest = RequestBu ilder.buildProjectRequest(projectDescription, projectKey, atlassianUserId, projectName);

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
}
