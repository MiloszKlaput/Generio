import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';
import { Issue } from '../models/issue/issue.model';

@Injectable({
  providedIn: 'root'
})
export class JiraApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/';

  sendIssues(issues: Issue[]): Observable<any> {
    const url = this.baseUrl + 'issues';
    const data = issues;

    console.log(data);
    return this.http.post(url, data);
  }

  testApi(): Observable<any> {
    const url = this.baseUrl + 'api';
    return this.http.get(url);
  }

  // getMetadata(): Observable<any> {
  //   const url = this.baseUrl + 'metadata';
  //   return this.http.get(url);
  // }
}
