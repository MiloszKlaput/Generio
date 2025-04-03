import { GeminiIssueFields } from "./gemini-issue-fields.model";

export interface GeminiIssue {
  geminiId: string;
  id: number;
  key: string;
  fields: GeminiIssueFields;
}
