import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';
import { Sprint } from '../models/sprint/sprint.model';
import { Project } from '../models/project/project.model';
import { MoveToEpicRequest } from '../models/issue/move-to-epic.model';
import { MoveToSprintRequest } from '../models/issue/move-to-sprint.model';
import { ProcessDataService } from './process-data.service';
import { Issue } from '../models/issue/issue.model';

@Injectable({
  providedIn: 'root'
})
export class JiraApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/';
  private processDataService = inject(ProcessDataService);

  createProject(project: Project): Observable<any> {

    const url = this.baseUrl + 'create-project';

    const { atlassianLogin, atlassianApiKey, atlassianUserJiraUrl } = this.processDataService.processData$.getValue()!.atlassianUserInfo!;

    const data = {
      userName: atlassianLogin,
      apiKey: atlassianApiKey,
      jiraBaseUrl: atlassianUserJiraUrl,
      project: project
    };

    return this.http.post<any>(url, data);
  }

  getBoardId(projectKey: string): Observable<{ data: number }> {
    const url = this.baseUrl + 'get-board-id';

    const { atlassianLogin, atlassianApiKey, atlassianUserJiraUrl } = this.processDataService.processData$.getValue()!.atlassianUserInfo!;

    const params = {
      userName: atlassianLogin,
      apiKey: atlassianApiKey,
      jiraBaseUrl: atlassianUserJiraUrl,
      projectKey: projectKey
    };

    return this.http.get<{ data: number }>(url, { params });
  }

  deleteSprintZero(boardId: number): Observable<any> {
    const url = this.baseUrl + 'delete-sprint-zero';

    const { atlassianLogin, atlassianApiKey, atlassianUserJiraUrl } = this.processDataService.processData$.getValue()!.atlassianUserInfo!;

    const params = {
      userName: atlassianLogin,
      apiKey: atlassianApiKey,
      jiraBaseUrl: atlassianUserJiraUrl,
      boardId: boardId.toString()
    };

    return this.http.get<any>(url, { params });
  }

  deleteProject(projectKey: string): Observable<string> {
    const url = this.baseUrl + 'delete-project';

    const { atlassianLogin, atlassianApiKey, atlassianUserJiraUrl } = this.processDataService.processData$.getValue()!.atlassianUserInfo!;

    const data = {
      userName: atlassianLogin,
      apiKey: atlassianApiKey,
      jiraBaseUrl: atlassianUserJiraUrl,
      projectKey: projectKey
    };

    return this.http.post<string>(url, data);
  }

  createSprint(sprint: Sprint): Observable<any> {
    const url = this.baseUrl + 'create-sprint';

    const { atlassianLogin, atlassianApiKey, atlassianUserJiraUrl } = this.processDataService.processData$.getValue()!.atlassianUserInfo!;

    const data = {
      userName: atlassianLogin,
      apiKey: atlassianApiKey,
      jiraBaseUrl: atlassianUserJiraUrl,
      sprint: sprint
    };

    return this.http.post<any>(url, data);
  }

  createIssues(issues: Issue[]): Observable<{ issues: Issue[], errors: any[] }> {
    const url = this.baseUrl + 'create-issues';

    const { atlassianLogin, atlassianApiKey, atlassianUserJiraUrl } = this.processDataService.processData$.getValue()!.atlassianUserInfo!;

    const data = {
      userName: atlassianLogin,
      apiKey: atlassianApiKey,
      jiraBaseUrl: atlassianUserJiraUrl,
      issues: issues
    };

    return this.http.post<{ issues: Issue[], errors: any[] }>(url, data);
  }

  moveIssuesToEpic(moveToEpicData: MoveToEpicRequest): Observable<MoveToEpicRequest> {
    const url = this.baseUrl + 'move-issues-to-epic';

    const { atlassianLogin, atlassianApiKey, atlassianUserJiraUrl } = this.processDataService.processData$.getValue()!.atlassianUserInfo!;

    const data = {
      userName: atlassianLogin,
      apiKey: atlassianApiKey,
      jiraBaseUrl: atlassianUserJiraUrl,
      epicId: moveToEpicData.id,
      issues: moveToEpicData.issuesKeys
    };

    return this.http.post<MoveToEpicRequest>(url, data);
  }

  moveIssuesToSprint(moveToSprintData: MoveToSprintRequest): Observable<MoveToSprintRequest> {
    const url = this.baseUrl + 'move-issues-to-sprint';

    const { atlassianLogin, atlassianApiKey, atlassianUserJiraUrl } = this.processDataService.processData$.getValue()!.atlassianUserInfo!;

    const data = {
      userName: atlassianLogin,
      apiKey: atlassianApiKey,
      jiraBaseUrl: atlassianUserJiraUrl,
      sprintId: moveToSprintData.id,
      issues: moveToSprintData.issuesKeys
    };

    return this.http.post<MoveToSprintRequest>(url, data);
  }
}
