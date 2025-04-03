import { JiraIssueResponseDTO } from "./jira-issue-response-dto.model";

export interface JiraIssuesResponseDTO {
  issues: JiraIssueResponseDTO[];
  errors: any;
}
