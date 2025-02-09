import { IssueFields } from "./issue-fields.model";

export interface Issue {
  id?: number;
  key?: string;
  self?: string;
  fields: IssueFields;
}
