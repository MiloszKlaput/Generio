export interface JiraSprintResponseDTO {
  id: number;
  self: string;
  state: string;
  name: string;
  startDate: string;
  endDate: string;
  originBoardId: number;
  goal: string;
}
