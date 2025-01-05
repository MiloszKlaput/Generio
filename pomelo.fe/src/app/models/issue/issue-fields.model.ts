import { IssueProject } from "./issue-project.model";
import { IssueType } from "./issue-type.model";

export interface IssueFields {
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
}
