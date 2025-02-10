import { IssueFields } from "./issue-fields.model";

export interface IssueRequest {
  fields: IssueFields;
}

export interface IssueResponse {
  id: number;
  key: string;
  self: string;
}

export interface Issue {
  id: number;
  key: string;
  self: string;
  fields: IssueFields;
}
