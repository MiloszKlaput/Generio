import { GeminiIssuePriority } from "./gemini-issue-priority.model";
import { GeminiIssueType } from "./gemini-issue-type.model";


export interface GeminiIssueFields {
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
  issuetype: GeminiIssueType;
  issuepriority: GeminiIssuePriority;
  summary: string;
  created: string;
}
