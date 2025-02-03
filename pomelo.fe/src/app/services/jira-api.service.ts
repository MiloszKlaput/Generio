import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';
import { IssuesRequest } from '../models/issue/issue.model';
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

  // Response
  //     {
  //       "id": 37,
  //       "self": "https://your-domain.atlassian.net/rest/agile/1.0/sprint/23",
  //       "state": "closed",
  //       "name": "sprint 1",
  //       "startDate": "2015-04-11T15:22:00.000+10:00",
  //       "endDate": "2015-04-20T01:22:00.000+10:00",
  //       "completeDate": "2015-04-20T11:04:00.000+10:00",
  //       "originBoardId": 5,
  //       "goal": "sprint 1 goal"
  //     }
  getBoardId(): Observable<number> {
    const url = this.baseUrl + 'get-board-id';
    return this.http.get<number>(url);
  }

// Response
// {
//   "id": 10010,
//   "key": "EX",
//   "self": "https://your-domain.atlassian.net/jira/rest/api/3/project/10042"
// }
  createProject(project: ProjectRequest): Observable<ProjectResponse> {
    const url = this.baseUrl + 'create-project';
    const data = project;

    return this.http.post<ProjectResponse>(url, data);
  }

  // Response
  // {
  //   "id": 37,
  //   "self": "https://your-domain.atlassian.net/rest/agile/1.0/sprint/23",
  //   "state": "future",
  //   "name": "sprint 1",
  //   "startDate": "2015-04-11T15:22:00.000+10:00",
  //   "endDate": "2015-04-20T01:22:00.000+10:00",
  //   "originBoardId": 5,
  //   "goal": "sprint 1 goal"
  // }
  createSprint(sprint: SprintRequest): Observable<any> {
    const url = this.baseUrl + 'create-sprint';
    const data = sprint;

    return this.http.post(url, data);
  }

//   Response
// {
//   "issues": [
//     {
//       "id": "10000",
//       "key": "ED-24",
//       "self": "https://your-domain.atlassian.net/rest/api/3/issue/10000",
//       "transition": {
//         "status": 200,
//         "errorCollection": {
//           "errorMessages": [],
//           "errors": {}
//         }
//       }
//     },
//     {
//       "id": "10001",
//       "key": "ED-25",
//       "self": "https://your-domain.atlassian.net/rest/api/3/issue/10001"
//     }
//   ],
//   "errors": []
// }
  createIssues(issues: IssuesRequest[]): Observable<any> {
    const url = this.baseUrl + 'create-issues';
    const data = issues;

    return this.http.post(url, data);
  }

  // moveIssuesToEpic(issues: Issue[]): Observable<any> {
  //   const url = this.baseUrl + 'move-issues-to-epic';
  //   const data = issues;

  //   return this.http.post(url, data);
  // }
}
