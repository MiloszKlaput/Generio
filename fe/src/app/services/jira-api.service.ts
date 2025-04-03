import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';
import { ProcessDataService } from './process-data.service';
import { JiraProjectRequestDTO } from '../models/jira/request/project/jira-project-request.model';
import { JiraProjectResponseDTO } from '../models/jira/response/project/jira-project-response.model';
import { JiraBoardResponseDTO } from '../models/jira/response/board/jira-board-response.model';
import { JiraSprintRequestDTO } from '../models/jira/request/sprint/jira-sprint-request.model';
import { JiraSprintResponseDTO } from '../models/jira/response/sprint/jira-sprint-response.model';
import { JiraIssueRequestDTO } from '../models/jira/request/issue/jira-issue-request-dto.model';
import { JiraIssuesResponseDTO } from '../models/jira/response/issue/jira-issues-response-dto.model';
import { MoveToEpicRequestDTO } from '../models/jira/request/move/move-to-epic.model';
import { MoveToSprintRequestDTO } from '../models/jira/request/move/move-to-sprint.model';

@Injectable({
  providedIn: 'root'
})
export class JiraApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/';
  private processDataService = inject(ProcessDataService);

  createProject(project: JiraProjectRequestDTO): Observable<JiraProjectResponseDTO> {
    const url = this.baseUrl + 'create-project';

    const { jiraLogin, jiraApiKey, jiraUserJiraUrl } = this.processDataService.jiraRequestData$.getValue()!.jiraUserInfoRequest!;

    const data = {
      userName: jiraLogin,
      apiKey: jiraApiKey,
      jiraBaseUrl: jiraUserJiraUrl,
      project: project
    };

    return this.http.post<JiraProjectResponseDTO>(url, data);
  }

  getBoardId(projectKey: string): Observable<JiraBoardResponseDTO> {
    const url = this.baseUrl + 'get-board-id';

    const { jiraLogin, jiraApiKey, jiraUserJiraUrl } = this.processDataService.jiraRequestData$.getValue()!.jiraUserInfoRequest!;

    const params = {
      userName: jiraLogin,
      apiKey: jiraApiKey,
      jiraBaseUrl: jiraUserJiraUrl,
      projectKey: projectKey
    };

    return this.http.get<JiraBoardResponseDTO>(url, { params });
  }

  deleteSprintZero(boardId: number): Observable<any> {
    const url = this.baseUrl + 'delete-sprint-zero';

    const { jiraLogin, jiraApiKey, jiraUserJiraUrl } = this.processDataService.jiraRequestData$.getValue()!.jiraUserInfoRequest!;

    const params = {
      userName: jiraLogin,
      apiKey: jiraApiKey,
      jiraBaseUrl: jiraUserJiraUrl,
      boardId: boardId.toString()
    };

    return this.http.get<any>(url, { params });
  }

  deleteProject(projectKey: string): Observable<string> {
    const url = this.baseUrl + 'delete-project';

    const { jiraLogin, jiraApiKey, jiraUserJiraUrl } = this.processDataService.jiraRequestData$.getValue()!.jiraUserInfoRequest!;

    const data = {
      userName: jiraLogin,
      apiKey: jiraApiKey,
      jiraBaseUrl: jiraUserJiraUrl,
      projectKey: projectKey
    };

    return this.http.post<string>(url, data);
  }

  createSprint(sprint: JiraSprintRequestDTO): Observable<JiraSprintResponseDTO> {
    const url = this.baseUrl + 'create-sprint';

    const { jiraLogin, jiraApiKey, jiraUserJiraUrl } = this.processDataService.jiraRequestData$.getValue()!.jiraUserInfoRequest!;

    const data = {
      userName: jiraLogin,
      apiKey: jiraApiKey,
      jiraBaseUrl: jiraUserJiraUrl,
      sprint: sprint
    };

    return this.http.post<JiraSprintResponseDTO>(url, data);
  }

  createIssues(issues: JiraIssueRequestDTO[]): Observable<JiraIssuesResponseDTO> {
    const url = this.baseUrl + 'create-issues';

    const { jiraLogin, jiraApiKey, jiraUserJiraUrl } = this.processDataService.jiraRequestData$.getValue()!.jiraUserInfoRequest!;

    const data = {
      userName: jiraLogin,
      apiKey: jiraApiKey,
      jiraBaseUrl: jiraUserJiraUrl,
      issues: issues
    };

    return this.http.post<JiraIssuesResponseDTO>(url, data);
  }

  moveIssuesToEpics(moveToEpicData: MoveToEpicRequestDTO): Observable<any> {
    const url = this.baseUrl + 'move-issues-to-epic';

    const { jiraLogin, jiraApiKey, jiraUserJiraUrl } = this.processDataService.jiraRequestData$.getValue()!.jiraUserInfoRequest!;

    const data = {
      userName: jiraLogin,
      apiKey: jiraApiKey,
      jiraBaseUrl: jiraUserJiraUrl,
      epicId: moveToEpicData.id,
      issues: moveToEpicData.issuesKeys
    };

    return this.http.post<any>(url, data);
  }

  moveIssuesToSprints(moveToSprintData: MoveToSprintRequestDTO): Observable<any> {
    const url = this.baseUrl + 'move-issues-to-sprint';

    const { jiraLogin, jiraApiKey, jiraUserJiraUrl } = this.processDataService.jiraRequestData$.getValue()!.jiraUserInfoRequest!;

    const data = {
      userName: jiraLogin,
      apiKey: jiraApiKey,
      jiraBaseUrl: jiraUserJiraUrl,
      sprintId: moveToSprintData.id,
      issues: moveToSprintData.issuesKeys
    };

    return this.http.post<any>(url, data);
  }
}
