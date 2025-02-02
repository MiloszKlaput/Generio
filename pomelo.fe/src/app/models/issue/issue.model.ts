import { IssueFields } from "./issue-fields.model";

export interface IssuesRequest {
  fields: IssueFields;
}

export interface IssuesResponse {
  issues: IssuesResponse[];
  errors: [];
}
