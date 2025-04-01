import { IssueFieldsJiraDTO } from "./issue-fields.model";

export interface IssueJiraDTO {
  geminiId?: string;
  id?: number;
  key?: string;
  fields?: IssueFieldsJiraDTO;
}
