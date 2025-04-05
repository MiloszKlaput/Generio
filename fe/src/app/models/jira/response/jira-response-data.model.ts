import { JiraProjectResponseDTO } from "./project/jira-project-response.model";
import { JiraBoardResponseDTO } from "./board/jira-board-response.model";
import { JiraIssueResponseDTO } from "./issue/jira-issue-response-dto.model";
import { JiraSprintResponseDTO } from "./sprint/jira-sprint-response.model";

export interface JiraResponseData {
  projectResponse: JiraProjectResponseDTO;
  boardResponse: JiraBoardResponseDTO;
  sprintsResponse: JiraSprintResponseDTO[];
  epicsResponse: JiraIssueResponseDTO[];
  issuesResponse: JiraIssueResponseDTO[];
}
