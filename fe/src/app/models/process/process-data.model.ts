import { DateTime } from "luxon";
import { IssueResponse } from "../issue/issue-response.model";
import { SprintResponse } from "../sprint/sprint.model";
import { Issue, IssueRequest } from "../issue/issue.model";

export interface RequestData {
  atlassianLogin: string;
  atlassianUserId: string;
  atlassianApiKey: string;
  atlassianUserJiraUrl: string;
  projectName: string;
  projectDescription: string;
  projectKey: string;
  sprintsCount: number;
  sprintDuration: number;
  projectStartDate: DateTime;
  epicsCount: number;
  issuesCount: number;
  issues: IssueRequest[];
  sprintIssuesAssigment: { [key: string]: { sprintId: number, issues: Issue[] } } | null;
}

export interface ResponseData {
  projectId: string;
  projectKey: string;
  projectLink: string;
  boardId: number;
  sprints: SprintResponse[];
  epicsIds: number[];
  issues: IssueResponse[];
}
