import { DateTime } from "luxon";
import { IssueResponse } from "../issue/issue-response.model";
import { MoveToSprintRequest } from "../issue/move-to-sprint.model";
import { SprintResponse } from "../sprint/sprint.model";
import { IssueRequest } from "../issue/issue.model";

export interface RequestData {
  projectName: string;
  projectDescription: string;
  projectKey: string;
  atlassianId: string;
  sprintsCount: number;
  sprintDuration: number;
  projectStartDate: DateTime;
  epicsCount: number;
  issuesCount: number;
  issuesTypes: {
    story: boolean;
    bug: boolean;
    task: boolean;
  },
  sprintIssuesAssigment: MoveToSprintRequest[];
  issues: IssueRequest[];
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
