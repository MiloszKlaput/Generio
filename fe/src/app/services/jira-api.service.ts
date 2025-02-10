import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';
import { Issue, IssueRequest, IssueResponse } from '../models/issue/issue.model';
import { SprintRequest, SprintResponse } from '../models/sprint/sprint.model';
import { ProjectRequest, ProjectResponse } from '../models/project/project.model';
import { MoveToEpicRequest } from '../models/issue/move-to-epic.model';
import { MoveToSprintRequest } from '../models/issue/move-to-sprint.model';

@Injectable({
  providedIn: 'root'
})
export class JiraApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/';

  testApi(): Observable<any> {
    const url = this.baseUrl + 'test-api';
    return this.http.get(url);
  }

  getBoardId(projectKey: string): Observable<{ data: number }> {
    const url = this.baseUrl + 'get-board-id';

    return this.http.get<{ data: number }>(url, { params: { projectKey } });
  }

  createProject(project: ProjectRequest): Observable<ProjectResponse> {
    const url = this.baseUrl + 'create-project';
    const data = project;

    return this.http.post<ProjectResponse>(url, data);
  }

  createSprint(sprint: SprintRequest): Observable<SprintResponse> {
    const url = this.baseUrl + 'create-sprint';
    const data = sprint;

    return this.http.post<SprintResponse>(url, data);
  }

  createIssues(issues: IssueRequest[]): Observable<{ issues: IssueResponse[], errors: any[] }> {
    const url = this.baseUrl + 'create-issues';
    const data = issues;

    return this.http.post<{ issues: IssueResponse[], errors: any[] }>(url, data);
  }

  moveIssuesToEpic(moveToEpicData: MoveToEpicRequest): Observable<MoveToEpicRequest> {
    const url = this.baseUrl + 'move-issues-to-epic';
    const data = { epicId: moveToEpicData.id, issues: moveToEpicData.issuesKeys };

    return this.http.post<MoveToEpicRequest>(url, data);
  }

  moveIssuesToSprint(moveToSprintData: MoveToSprintRequest): Observable<MoveToSprintRequest> {
    const url = this.baseUrl + 'move-issues-to-sprint';
    const data = { sprintId: moveToSprintData.id, issues: moveToSprintData.issuesKeys };

    return this.http.post<MoveToSprintRequest>(url, data);
  }
}
