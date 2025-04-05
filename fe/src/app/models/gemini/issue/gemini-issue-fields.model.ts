import { IssuePriorityEnum } from "../../../enums/issue-priority.enum";
import { IssueTypeEnum } from "../../../enums/issue-type.enum";

export interface GeminiIssueFields {
  description: string;
  issuetype: IssueTypeEnum;
  priority: IssuePriorityEnum;
  summary: string;
}
