import { JiraIssueRequestDTO } from "./issue/jira-issue-request-dto.model";
import { JiraUserInfoRequestDTO } from "./jira-user-info/jira-user-info-request.model";
import { JiraProjectRequestDTO } from "./project/jira-project-request.model";
import { JiraSprintRequestDTO } from "./sprint/jira-sprint-request.model";

export interface JiraRequestData {
  jiraUserInfoRequest: JiraUserInfoRequestDTO;
  projectRequest: JiraProjectRequestDTO;
  sprintsRequests: JiraSprintRequestDTO[];
  epicsRequests: JiraIssueRequestDTO[];
  issuesRequests: JiraIssueRequestDTO[];
}
