import { IssueGeminiDTO } from "../issue/issue.model";

export interface EpicGeminiDTO extends IssueGeminiDTO {
  issuesGeminiIds?: number[];
}
