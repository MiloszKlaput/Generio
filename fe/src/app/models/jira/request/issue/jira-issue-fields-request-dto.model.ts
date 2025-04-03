
import { JiraIssuePriorityRequestDTO } from "./jira-issue-priority-request-dto.model";
import { JiraIssueTypeRequestDTO } from "./jira-issue-type-request-dto.model";

export interface JiraIssueFieldsRequestDTO {
  description: {
    content: [
      {
        content: [
          {
            text: string,
            type: "text"
          }
        ],
        type: "paragraph"
      }
    ],
    type: "doc",
    version: 1
  };
  issuetype: JiraIssueTypeRequestDTO;
  issuepriority: JiraIssuePriorityRequestDTO;
  summary: string;
  created: string;
  customfield_99999: string; // geminiIssueId
}
