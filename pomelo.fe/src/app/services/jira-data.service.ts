import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JiraDataService {
  private boardId: number | null = null;
  private sprintsIds: string[] | null = null;
  private epicsIds: string[] | null = null;

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
}

