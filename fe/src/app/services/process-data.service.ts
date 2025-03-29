import { Injectable } from '@angular/core';
import { ProcessFormData } from '../models/process/process-form-data.model';
import { ProcessData } from '../models/process/process-data.model';
import { DateTime } from 'luxon';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessDataService {
  formData$ = new BehaviorSubject<ProcessFormData | null>(null);
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
      sprintsCount: 1,
      sprintDuration: 14,
      projectStartDate: DateTime.now(),
      epicsCount: 1,
      issuesCount: 0,
      issues: [],
      sprintIssuesAssigment: null,
      projectId: '',
      projectLink: '',
      boardId: 0,
      sprints: [],
      epicsIds: []
    });
  }
}
