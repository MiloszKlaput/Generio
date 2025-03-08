import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';
import { IssueRequest, IssueResponse } from '../models/issue/issue.model';
import { SprintRequest, SprintResponse } from '../models/sprint/sprint.model';
import { ProjectRequest, ProjectResponse } from '../models/project/project.model';
import { MoveToEpicRequest } from '../models/issue/move-to-epic.model';
import { MoveToSprintRequest } from '../models/issue/move-to-sprint.model';
import { ProcessDataService } from './process-data.service';

@Injectable({
  providedIn: 'root'
})
export class JiraApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/';
  private processDataService = inject(ProcessDataService);

  getBoardId(projectKey: string): Observable<{ data: number }> {
    const url = this.baseUrl + 'get-board-id';
    const params = {
      userName: this.processDataService.requestData.atlassianLogin,
      apiKey: this.processDataService.requestData.atlassianApiKey,
      projectKey
    }

    return this.http.get<{ data: number }>(url, { params });
  }

  createProject(project: ProjectRequest): Observable<ProjectResponse> {
    const url = this.baseUrl + 'create-project';
    const data = {
      userName: this.processDataService.requestData.atlassianLogin,
      apiKey: this.processDataService.requestData.atlassianApiKey,
      project
    };

    return this.http.post<ProjectResponse>(url, data);
  }

  deleteProject(projectKey: string): Observable<string> {
    const url = this.baseUrl + 'delete-project';
    const data = {
      userName: this.processDataService.requestData.atlassianLogin,
      apiKey: this.processDataService.requestData.atlassianApiKey,
      projectKey
    };

    return this.http.post<string>(url, data);
  }

  createSprint(sprint: SprintRequest): Observable<SprintResponse> {
    const url = this.baseUrl + 'create-sprint';
    const data = {
      userName: this.processDataService.requestData.atlassianLogin,
      apiKey: this.processDataService.requestData.atlassianApiKey,
      sprint
    };

    return this.http.post<SprintResponse>(url, data);
  }

  createIssues(issues: IssueRequest[]): Observable<{ issues: IssueResponse[], errors: any[] }> {
    const url = this.baseUrl + 'create-issues';
    const data = {
      userName: this.processDataService.requestData.atlassianLogin,
      apiKey: this.processDataService.requestData.atlassianApiKey,
      issues
    };

    return this.http.post<{ issues: IssueResponse[], errors: any[] }>(url, data);
  }

  moveIssuesToEpic(moveToEpicData: MoveToEpicRequest): Observable<MoveToEpicRequest> {
    const url = this.baseUrl + 'move-issues-to-epic';
    const data = {
      userName: this.processDataService.requestData.atlassianLogin,
      apiKey: this.processDataService.requestData.atlassianApiKey,
      epicId: moveToEpicData.id,
      issues: moveToEpicData.issuesKeys
    };

    return this.http.post<MoveToEpicRequest>(url, data);
  }

  moveIssuesToSprint(moveToSprintData: MoveToSprintRequest): Observable<MoveToSprintRequest> {
    const url = this.baseUrl + 'move-issues-to-sprint';
    const data = {
      userName: this.processDataService.requestData.atlassianLogin,
      apiKey: this.processDataService.requestData.atlassianApiKey,
      sprintId: moveToSprintData.id,
      issues: moveToSprintData.issuesKeys
    };

    return this.http.post<MoveToSprintRequest>(url, data);
  }
}
