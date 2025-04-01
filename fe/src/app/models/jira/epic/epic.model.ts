import { IssueJiraDTO } from "../issue/issue.model";

export interface EpicJiraDTO extends IssueJiraDTO {
  issuesIds: number[];
}
