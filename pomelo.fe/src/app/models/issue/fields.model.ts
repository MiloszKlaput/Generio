import { IssueType } from "./issue-type.model";
import { Project } from "./project.model";
import { Status } from "./status.model";

export interface Fields {
  description: string;
  issuetype: IssueType;
  project: Project;
  summary: string;
}
