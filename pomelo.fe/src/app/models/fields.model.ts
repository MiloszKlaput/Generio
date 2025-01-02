import { IssueType } from "./issue-type.model";
import { Project } from "./project.model";
import { Status } from "./status.model";

export interface Fields {
  created: Date; // nie wiem czy mamy wplyw
  description: string;
  issueType: IssueType;
  project: Project;
  status: Status;
  statusCategoryChangeDate: Date; // nie wiem czy mamy wplyw
  summary: string;
}
