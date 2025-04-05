import { inject, Injectable } from '@angular/core';
import { JiraApiService } from './jira-api.service';
import { from, mergeMap, toArray, tap, Observable, concatMap } from 'rxjs';
import { ProcessStateService } from './process-state.service';
import { ProcessState } from '../enums/process-state.enum';
import { ProcessDataService } from './process-data.service';
import { GeminiService } from './gemini.service';
import { GeminiResponse } from '../models/gemini/gemini-response.model';
import { JiraProjectResponseDTO } from '../models/jira/response/project/jira-project-response.model';
import { JiraRequestDTOMapper } from '../mapper/jira-request-dto-mapper';
import { JiraBoardResponseDTO } from '../models/jira/response/board/jira-board-response.model';
import { JiraSprintResponseDTO } from '../models/jira/response/sprint/jira-sprint-response.model';
import { JiraSprintRequestDTO } from '../models/jira/request/sprint/jira-sprint-request.model';
import { JiraIssueRequestDTO } from '../models/jira/request/issue/jira-issue-request-dto.model';
import { JiraIssuesResponseDTO } from '../models/jira/response/issue/jira-issues-response-dto.model';
import { MoveToEpicRequestDTO } from '../models/jira/request/move/move-to-epic.model';
import { MoveToSprintRequestDTO } from '../models/jira/request/move/move-to-sprint.model';

@Injectable({
  providedIn: 'root'
})
export class JiraPopulateProcessService {
  private jiraApiService = inject(JiraApiService);
  private geminiService = inject(GeminiService);
  private processStateService = inject(ProcessStateService);
  private processDataService = inject(ProcessDataService);

  startProcess(jiraLogin: string, jiraUserId: string, jiraApiKey: string, jiraUserJiraUrl: string, geminiApiKey: string, geminiMessage: string): void {
    this.processStateService.setProcessState(ProcessState.InProgress);

    const jiraUserInfo = { jiraLogin, jiraUserId, jiraApiKey, jiraUserJiraUrl };
    this.processDataService.updateJiraRequestData({ jiraUserInfoRequest: jiraUserInfo });

    this.createContent(geminiMessage, geminiApiKey)
      .pipe(
        concatMap(() => this.createNewProject()),
        concatMap(() => this.getBoardId()),
        concatMap(() => this.deleteSprintZero()),
        concatMap(() => this.createSprints()),
        concatMap(() => this.createEpics()),
        concatMap(() => this.createIssues()),
        concatMap(() => this.moveIssuesToEpics()),
        concatMap(() => this.moveIssuesToSprints()),
      )
      .subscribe({
        next: () => {
          this.processStateService.setProcessState(ProcessState.Success);
        },
        error: (err) => {
          this.handleError(err);
        }
      });
  }

  clearData(): void {
    this.jiraApiService.deleteProject(this.processDataService.jiraResponseData$.getValue()!.projectResponse?.key!).subscribe();
  }

  private handleError(err: any) {
    this.processStateService.setProcessState(ProcessState.Error);
    this.setErrorMessage(err);
    if (!this.processDataService.jiraResponseData$.getValue()!.projectResponse?.key) {
      return;
    }
    this.clearData();
  }

  private setErrorMessage(err: any): void {
    console.log(err);
    if (!err || err.length <= 0) {
      return;
    }
    const errMsg = JSON.stringify(err.error, null, 2);
    const formatedErrMsgArr = errMsg.replace(/{|}|"/g, '').split(': ');
    const formatedErrMsg = formatedErrMsgArr[formatedErrMsgArr.length - 1];

    this.processDataService.errorMessage$.next(formatedErrMsg);
  }

  private createContent(geminiMessage: string, geminiApiKey: string): Observable<string | null> {
    return this.geminiService.generateContent(geminiMessage, geminiApiKey).pipe(
      tap((result: string | null) => {
        if (result !== null) {
          this.handleGeminiResponse(result);
        }
      })
    );
  }

  private createNewProject(): Observable<JiraProjectResponseDTO> {
    const geminiProject = this.processDataService.geminiResponseData$.getValue()!.project;
    const jiraUserId = this.processDataService.jiraRequestData$.getValue()!.jiraUserInfoRequest.jiraUserId;

    const projectRequest = JiraRequestDTOMapper.toProjectRequestDto(geminiProject, jiraUserId);

    this.processDataService.updateJiraRequestData({ projectRequest: projectRequest });

    return this.jiraApiService.createProject(projectRequest).pipe(
      tap((result: JiraProjectResponseDTO) => {
        if (result) {
          this.processDataService.updateJiraResponseData({ projectResponse: result });
        }
      })
    );
  }

  private getBoardId(): Observable<JiraBoardResponseDTO> {
    const projectKey = this.processDataService.jiraResponseData$.getValue()!.projectResponse.key;

    return this.jiraApiService.getBoardId(projectKey).pipe(
      tap((result: JiraBoardResponseDTO) => {
        if (result) {
          this.processDataService.updateJiraResponseData({ boardResponse: result });
        }
      })
    );
  }

  private deleteSprintZero(): Observable<any> {
    const boardId = this.processDataService.jiraResponseData$.getValue()!.boardResponse.id;

    return this.jiraApiService.deleteSprintZero(boardId);
  }

  private createSprints(): Observable<JiraSprintResponseDTO[]> {
    const geminiSprints = this.processDataService.geminiResponseData$.getValue()!.sprints;
    const boardId = this.processDataService.jiraResponseData$.getValue()!.boardResponse.id;

    const sprintsRequests: JiraSprintRequestDTO[] = JiraRequestDTOMapper.toSprintsRequestDto(geminiSprints, boardId);
    this.processDataService.updateJiraRequestData({ sprintsRequests: sprintsRequests });

    return from(sprintsRequests).pipe(
      concatMap((sprint: JiraSprintRequestDTO) => this.jiraApiService.createSprint(sprint)),
      toArray(),
      tap((result: JiraSprintResponseDTO[]) => {
        if (result) {
          this.processDataService.updateJiraResponseData({ sprintsResponse: result });
        }
      })
    );
  }

  private createEpics(): Observable<JiraIssuesResponseDTO> {
    const geminiEpics = this.processDataService.geminiResponseData$.getValue()!.epics;
    const projectId = this.processDataService.jiraResponseData$.getValue()!.projectResponse.id.toString();

    const epicsRequests: JiraIssueRequestDTO[] = JiraRequestDTOMapper.toIssueRequestDto(geminiEpics, projectId);
    this.processDataService.updateJiraRequestData({ epicsRequests: epicsRequests });

    return this.jiraApiService.createIssues(epicsRequests).pipe(
      tap((result: JiraIssuesResponseDTO) => {
        if (result.issues) {
          this.processDataService.updateJiraResponseData({ epicsResponse: result.issues });
        }
      })
    );
  }

  private createIssues(): Observable<JiraIssuesResponseDTO> {
    const geminiIssues = this.processDataService.geminiResponseData$.getValue()!.issues;
    const projectId = this.processDataService.jiraResponseData$.getValue()!.projectResponse.id.toString();

    const issuesRequests: JiraIssueRequestDTO[] = JiraRequestDTOMapper.toIssueRequestDto(geminiIssues, projectId);
    this.processDataService.updateJiraRequestData({ issuesRequests: issuesRequests });

    return this.jiraApiService.createIssues(issuesRequests).pipe(
      tap((result: JiraIssuesResponseDTO) => {
        if (result.issues) {
          this.processDataService.updateJiraResponseData({ issuesResponse: result.issues });
        }
      })
    );
  }

  private moveIssuesToEpics(): Observable<any> {
    const geminiEpics = this.processDataService.geminiResponseData$.getValue()!.epics;
    const jiraEpicsRequest = this.processDataService.jiraRequestData$.getValue()!.epicsRequests;
    const jiraEpicsResponse = this.processDataService.jiraResponseData$.getValue()!.epicsResponse;
    const jiraIssuesRequest = this.processDataService.jiraRequestData$.getValue()!.issuesRequests;
    const jiraIssuesResponse = this.processDataService.jiraResponseData$.getValue()!.issuesResponse;

    const moveIssuesToEpicsRequests = JiraRequestDTOMapper.toMoveIssuesToEpicsRequestDto(geminiEpics, jiraEpicsRequest, jiraEpicsResponse, jiraIssuesRequest, jiraIssuesResponse);

    return from(moveIssuesToEpicsRequests).pipe(
      mergeMap((req: MoveToEpicRequestDTO) => this.jiraApiService.moveIssuesToEpics(req)),
      toArray()
    );
  }

  private moveIssuesToSprints(): Observable<any> {
    const geminiSprints = this.processDataService.geminiResponseData$.getValue()!.sprints;
    const jiraSprintsRequest = this.processDataService.jiraRequestData$.getValue()!.sprintsRequests;
    const jiraSprintsResponse = this.processDataService.jiraResponseData$.getValue()!.sprintsResponse;
    const jiraIssuesRequest = this.processDataService.jiraRequestData$.getValue()!.issuesRequests;
    const jiraIssuesResponse = this.processDataService.jiraResponseData$.getValue()!.issuesResponse;

    const moveIssuesToSprintsRequests = JiraRequestDTOMapper.toMoveIssuesToSprintsRequestDto(geminiSprints, jiraSprintsRequest, jiraSprintsResponse, jiraIssuesRequest, jiraIssuesResponse);


    return from(moveIssuesToSprintsRequests).pipe(
      mergeMap((req: MoveToSprintRequestDTO) => this.jiraApiService.moveIssuesToSprints(req)),
      toArray()
    );
  }

  private handleGeminiResponse(res: string): void {
    const cleanedResponse = res.replace(/```json\s*|\s*```/g, ''); // taki format zwraca Gemini
    const json = JSON.parse(cleanedResponse);

    const geminiResponse: GeminiResponse = {
      project: json.project,
      epics: json.epics,
      issues: json.issues,
      sprints: json.sprints
    };
    console.log(geminiResponse);
    this.processDataService.geminiResponseData$.next(geminiResponse);
  }
}
