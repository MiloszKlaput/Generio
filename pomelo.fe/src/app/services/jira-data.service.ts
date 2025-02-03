import { Injectable } from '@angular/core';
import { ProcessData } from '../models/process/process-data.model';

@Injectable({
  providedIn: 'root'
})
export class JiraDataService {
  private boardId: number | null = null;
  private sprintsIds: string[] | null = null;
  private epicsIds: string[] | null = null;
  private processData: ProcessData | null = null;

  setBoardId(id: number): void {
    this.boardId = id;
  }

  getBoardId(): number | null {
    return this.boardId;
  }

  setSprintsIds(ids: string[]): void {
    this.sprintsIds = [...ids];
  }

  getSprintsIds(): string[] | null {
    return this.sprintsIds ? [...this.sprintsIds] : null;
  }

  setEpicsIds(ids: string[]): void {
    this.epicsIds = [...ids];
  }

  getEpicsIds(): string[] | null {
    return this.epicsIds ? [...this.epicsIds] : null;
  }

  setProcessData(processData: ProcessData): void {
    this.processData = processData;
  }
}

