import { DateTime } from "luxon";
import { Issue } from "../issue/issue.model";
import { SprintResponse } from "../sprint/sprint.model";

export interface ProcessData {
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
  issues: Issue[];
  sprintIssuesAssigment: { [key: string]: { sprintId: number, issues: Issue[] } } | null;
  projectId: string;
  projectLink: string;
  boardId: number;
  sprints: SprintResponse[];
  epicsIds: number[];
  geminiResponse: string;
}
