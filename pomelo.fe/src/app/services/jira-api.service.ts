import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';
import { IssuesRequest, IssuesResponse } from '../models/issue/issue.model';
import { SprintRequest, SprintResponse } from '../models/sprint/sprint.model';
import { ProjectRequest, ProjectResponse } from '../models/project/project.model';

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

  getBoardId(): Observable<number> {
    const url = this.baseUrl + 'get-board-id';
    return this.http.get<number>(url);
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

  createIssues(issues: IssuesRequest[]): Observable<IssuesResponse> {
    const url = this.baseUrl + 'create-issues';
    const data = issues;

    return this.http.post<IssuesResponse>(url, data);
  }

  moveIssuesToSprint(issues: IssuesRequest[], sprintId: string): Observable<any> {
    const url = this.baseUrl + 'move-issues-to-sprint';
    const data = { issues, sprintId };

    return this.http.post(url, data);
  }

  moveIssuesToEpic(issues: IssuesRequest[], epicId: string): Observable<any> {
    const url = this.baseUrl + 'move-issues-to-epic';
    const data = { issues, epicId };

    return this.http.post(url, data);
  }
}
