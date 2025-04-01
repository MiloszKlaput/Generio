import { IssuePriorityGeminiDTO } from "./issue-priority.model";
import { IssueTypeGeminiDTO } from "./issue-type.model";

export interface IssueFieldsGeminiDTO {
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
  issuetype: IssueTypeGeminiDTO;
  issuepriority: IssuePriorityGeminiDTO;
  summary: string;
  created: string;
}
