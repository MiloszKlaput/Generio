import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';
import { Sprint } from '../models/generio/sprint/sprint.model';
import { Project } from '../models/generio/project/project.model';
import { MoveToEpicRequest } from '../models/generio/issue/move-to-epic.model';
import { MoveToSprintRequest } from '../models/generio/issue/move-to-sprint.model';
import { ProcessDataService } from './process-data.service';
import { Issue } from '../models/generio/issue/issue.model';

@Injectable({
  providedIn: 'root'
})
export class JiraApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/';
  private processDataService = inject(ProcessDataService);

  createProject(project: Project): Observable<any> {

    const url = this.baseUrl + 'create-project';

    const { jiraLogin, jiraApiKey, jiraUserJiraUrl } = this.processDataService.processData$.getValue()!.jiraUserInfo!;

    const data = {
      userName: jiraLogin,
      apiKey: jiraApiKey,
      jiraBaseUrl: jiraUserJiraUrl,
      project: project
    };

    return this.http.post<any>(url, data);
  }

  getBoardId(projectKey: string): Observable<{ data: number }> {
    const url = this.baseUrl + 'get-board-id';

    const { jiraLogin, jiraApiKey, jiraUserJiraUrl } = this.processDataService.processData$.getValue()!.jiraUserInfo!;

    const params = {
      userName: jiraLogin,
      apiKey: jiraApiKey,
      jiraBaseUrl: jiraUserJiraUrl,
      projectKey: projectKey
    };

    return this.http.get<{ data: number }>(url, { params });
  }

  deleteSprintZero(boardId: number): Observable<any> {
    const url = this.baseUrl + 'delete-sprint-zero';

    const { jiraLogin, jiraApiKey, jiraUserJiraUrl } = this.processDataService.processData$.getValue()!.jiraUserInfo!;

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

    const { jiraLogin, jiraApiKey, jiraUserJiraUrl } = this.processDataService.processData$.getValue()!.jiraUserInfo!;

    const data = {
      userName: jiraLogin,
      apiKey: jiraApiKey,
      jiraBaseUrl: jiraUserJiraUrl,
      projectKey: projectKey
    };

    return this.http.post<string>(url, data);
  }

  createSprint(sprint: Sprint): Observable<any> {
    const url = this.baseUrl + 'create-sprint';

    const { jiraLogin, jiraApiKey, jiraUserJiraUrl } = this.processDataService.processData$.getValue()!.jiraUserInfo!;

    const data = {
      userName: jiraLogin,
      apiKey: jiraApiKey,
      jiraBaseUrl: jiraUserJiraUrl,
      sprint: sprint
    };

    return this.http.post<any>(url, data);
  }

  createIssues(issues: Issue[]): Observable<{ issues: Issue[], errors: any[] }> {
    const url = this.baseUrl + 'create-issues';

    const { jiraLogin, jiraApiKey, jiraUserJiraUrl } = this.processDataService.processData$.getValue()!.jiraUserInfo!;

    const data = {
      userName: jiraLogin,
      apiKey: jiraApiKey,
      jiraBaseUrl: jiraUserJiraUrl,
      issues: issues
    };

    return this.http.post<{ issues: Issue[], errors: any[] }>(url, data);
  }

  moveIssuesToEpic(moveToEpicData: MoveToEpicRequest): Observable<MoveToEpicRequest> {
    const url = this.baseUrl + 'move-issues-to-epic';

    const { jiraLogin, jiraApiKey, jiraUserJiraUrl } = this.processDataService.processData$.getValue()!.jiraUserInfo!;

    const data = {
      userName: jiraLogin,
      apiKey: jiraApiKey,
      jiraBaseUrl: jiraUserJiraUrl,
      epicId: moveToEpicData.id,
      issues: moveToEpicData.issuesKeys
    };

    return this.http.post<MoveToEpicRequest>(url, data);
  }

  moveIssuesToSprint(moveToSprintData: MoveToSprintRequest): Observable<MoveToSprintRequest> {
    const url = this.baseUrl + 'move-issues-to-sprint';

    const { jiraLogin, jiraApiKey, jiraUserJiraUrl } = this.processDataService.processData$.getValue()!.jiraUserInfo!;

    const data = {
      userName: jiraLogin,
      apiKey: jiraApiKey,
      jiraBaseUrl: jiraUserJiraUrl,
      sprintId: moveToSprintData.id,
      issues: moveToSprintData.issuesKeys
    };

    return this.http.post<MoveToSprintRequest>(url, data);
  }
}
