import { DateTime } from "luxon";

export interface SprintRequest {
  endDate: string;
  goal: string;
  name: string;
  originBoardId: number;
  startDate: string;
}

export interface SprintResponse {
  data: {
    id: number,
    self: string,
    state: string,
    name: string,
    startDate: DateTime,
    endDate: DateTime,
    originBoardId: number,
    goal: string
  }
}
