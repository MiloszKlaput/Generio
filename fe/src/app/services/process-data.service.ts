import { Injectable } from '@angular/core';
import { ProcessData } from '../models/process/process-data.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessDataService {
  processData$ = new BehaviorSubject<ProcessData | null>(null);
  errorMessage$ = new BehaviorSubject<string>('');

  initProcessData(): void {
    this.processData$.next({
      atlassianUserInfo: undefined,
      project: undefined,
      board: undefined,
      epics: [],
      issues: [],
      sprints: []
    });
  }
}
