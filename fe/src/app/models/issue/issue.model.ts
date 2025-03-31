import { IssueFields } from "./issue-fields.model";

export interface Issue {
  geminiId?: string;
  id?: number;
  key?: string;
  fields?: IssueFields;
}
