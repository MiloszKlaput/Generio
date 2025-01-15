import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';
import { Issue } from '../models/issue/issue.model';
import { Sprint } from '../models/sprint/sprint.model';
import { Project } from '../models/project/project.model';

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

  getSprintZero(): Observable<any> {
    const url = this.baseUrl + 'get-sprint-zero';
    return this.http.get(url);
  }

  createProject(project: Project): Observable<any> {
    const url = this.baseUrl + 'create-project';
    const data = project;

    return this.http.post(url, data);
  }

  createSprint(sprint: Sprint): Observable<any> {
    const url = this.baseUrl + 'create-sprint';
    const data = sprint;

    return this.http.post(url, data);
  }

  createIssues(issues: Issue[]): Observable<any> {
    const url = this.baseUrl + 'create-issues';
    const data = issues;

    return this.http.post(url, data);
  }

  createEpics(epics: Issue[]): Observable<any> {
    const url = this.baseUrl + 'create-issues';
    const data = epics;

    return this.http.post(url, data);
  }

  // getUserAtlassianId

  // moveIssuesToEpic(issues: Issue[]): Observable<any> {
  //   const url = this.baseUrl + 'create-issues';
  //   const data = issues;

  //   return this.http.post(url, data);
  // }

  // moveIssuesToSprint(issues: Issue[]): Observable<any> {
  //   const url = this.baseUrl + 'create-issues';
  //   const data = issues;

  //   return this.http.post(url, data);
  // }
}
