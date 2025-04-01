import { Injectable } from '@angular/core';
import { ProcessData } from '../models/generio/process/process-data.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessDataService {
  processData$ = new BehaviorSubject<ProcessData | null>(null);
  errorMessage$ = new BehaviorSubject<string | null>(null);

  initProcessData(): void {
    this.processData$.next({
      jiraUserInfo: null,
      project: null,
      board: null,
      epics: [],
      issues: [],
      sprints: []
    });
  }
}
