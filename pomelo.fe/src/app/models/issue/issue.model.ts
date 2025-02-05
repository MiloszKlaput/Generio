import { IssueFields } from "./issue-fields.model";
import { IssueResponse } from "./issue-response.model";

export interface IssuesRequest {
  fields: IssueFields;
}

export interface IssuesResponse {
  data: {
    issues: IssueResponse[];
    errors: [];
  }
}
