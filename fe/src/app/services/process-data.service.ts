import { Injectable } from '@angular/core';
import { ProcessData } from '../models/process/process-data.model';
import { DateTime } from 'luxon';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessDataService {
  processData$ = new BehaviorSubject<ProcessData | null>(null);
  errorMessage$ = new BehaviorSubject<string | null>(null);

  initProcessData(): void {
    this.processData$.next({
      atlassianLogin: '',
      atlassianUserId: '',
      atlassianApiKey: '',
      atlassianUserJiraUrl: '',
      projectName: '',
      projectDescription: '',
      projectKey: '',
      projectId: '',
      projectLink: '',
      issues: [],
      sprintIssuesAssigment: null,
      boardId: 0,
      sprints: [],
      epicsIds: [],
      geminiResponse: ''
    });
  }
}
