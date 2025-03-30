import { Issue } from "../issue/issue.model";
import { Sprint } from "../sprint/sprint.model";

export interface ProcessData {
  atlassianLogin: string;
  atlassianUserId: string;
  atlassianApiKey: string;
  atlassianUserJiraUrl: string;
  projectName: string;
  projectDescription: string;
  projectKey: string;
  projectId: string;
  projectLink: string;
  issues: Issue[];
  sprintIssuesAssigment: { [key: string]: { sprintId: number, issues: Issue[] } } | null;
  boardId: number;
  sprints: Sprint[];
  epicsIds: number[];
  geminiResponse: string;
}
