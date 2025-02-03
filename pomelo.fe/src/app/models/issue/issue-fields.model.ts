import { IssuePriority } from "./enums/issue-priority.enum";
import { IssueProject } from "./issue-project.model";
import { IssueType } from "./issue-type.model";

export interface IssueFields {
  id?: string;
  key?: string;
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
  issuetype: IssueType;
  project: IssueProject;
  summary: string;
  priority: IssuePriority | null;
  // story points estimation
  customfield_10016: number;
}
