import { DateTime } from "luxon";
import { IsProjectNeeded } from "../../enums/is-project-needed.enum";
import { IssueResponse } from "../issue/issue-response.model";
import { MoveToSprintRequest } from "../issue/move-to-sprint.model";
import { SprintResponse } from "../sprint/sprint.model";
import { Issue } from "../issue/issue.model";

export interface RequestData {
  isProjectNeeded: IsProjectNeeded;
  existingProjectKey: string;
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
  issues: Issue[];
}

export interface ResponseData {
  projectId: string;
  projectKey: string;
  projectLink: string;
  boardId: number;
  sprints: SprintResponse[];
  epicsIds: number[];
  issues: Issue[];
}
