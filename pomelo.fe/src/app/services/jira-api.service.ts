import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';;
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JiraApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/';

  testApi(): Observable<any> {
    const url = this.baseUrl + 'api';
    return this.http.get(url);
  }

  getMetadata(): Observable<any> {
    const url = this.baseUrl + 'metadata';
    return this.http.get(url);
  }
}
