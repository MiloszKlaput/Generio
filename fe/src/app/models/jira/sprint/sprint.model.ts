export interface SprintDTO {
  id: number;
  self: string;
  state: string;
  startDate: string;
  endDate: string;
  name: string;
  goal: string;
  originBoardId: number;
  issuesIds: number[];
}
