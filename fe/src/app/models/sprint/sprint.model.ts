export interface SprintRequest {
  startDate: string;
  endDate: string;
  name: string;
  goal: string;
  originBoardId: number;
}

export interface SprintUpdateRequest {
  startDate: string;
  endDate: string;
  id: number;
  name: string;
  state: string; // future / active / close
}

export interface SprintResponse {
  data: {
    id: number,
    self: string,
    state: string,
    name: string,
    startDate: string,
    endDate: string,
    originBoardId: number,
    goal: string
  }
}
