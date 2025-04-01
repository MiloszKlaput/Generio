import { IssuePriorityJiraDTO } from "./issue-priority.model";
import { IssueTypeJiraDTO } from "./issue-type.model";

export interface IssueFieldsJiraDTO {
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
  issuetype: IssueTypeJiraDTO;
  issuepriority: IssuePriorityJiraDTO;
  summary: string;
  created: string;
}
