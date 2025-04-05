import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GeminiResponse } from '../models/gemini/gemini-response.model';
import { JiraRequestData } from '../models/jira/request/jira-request-data.model';
import { JiraResponseData } from '../models/jira/response/jira-response-data.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessDataService {
  geminiResponseData$ = new BehaviorSubject<GeminiResponse | null>(null);
  jiraRequestData$ = new BehaviorSubject<JiraRequestData | null>(null);
  jiraResponseData$ = new BehaviorSubject<JiraResponseData | null>(null);
  errorMessage$ = new BehaviorSubject<string | null>(null);

  updateJiraRequestData(partialJiraRequestData: Partial<JiraRequestData>): void {
    const currentJiraRequestData = this.jiraRequestData$.getValue()!;
    this.jiraRequestData$.next({ ...currentJiraRequestData, ...partialJiraRequestData });
  }

  updateJiraResponseData(partialJiraResponseData: Partial<JiraResponseData>): void {
    const currentJiraResponseData = this.jiraResponseData$.getValue()!;
    this.jiraResponseData$.next({ ...currentJiraResponseData, ...partialJiraResponseData });
  }
}
