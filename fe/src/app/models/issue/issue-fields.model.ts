import { IssueProject } from "./issue-project.model";
import { IssueType } from "./issue-type.model";

export interface IssueFields {
  id?: number;
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
  created?: string | null;
  updated?: string | null;
  status?: string;
  resolution?: string;
  storyPoints?: number;
}
