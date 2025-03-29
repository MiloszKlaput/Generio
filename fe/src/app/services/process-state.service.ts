import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProcessState } from '../enums/process-state.enum';

@Injectable({
  providedIn: 'root'
})
export class ProcessStateService {
  private state$ = new BehaviorSubject<ProcessState>(ProcessState.New);

  getProcessState() {
    return this.state$.asObservable();
  }

  setProcessState(state: ProcessState): void {
    this.state$.next(state);
  }
}
