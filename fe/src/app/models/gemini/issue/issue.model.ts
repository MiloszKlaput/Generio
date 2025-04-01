import { IssueFieldsGeminiDTO } from "./issue-fields.model";

export interface IssueGeminiDTO {
  geminiId?: string;
  id?: number;
  key?: string;
  fields?: IssueFieldsGeminiDTO;
}
