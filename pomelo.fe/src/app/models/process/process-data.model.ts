import { IsProjectNeeded } from "../../enums/is-project-needed.enum";
import { IssueResponse } from "../issue/issue-response.model";

export interface ProcessData {
  isProjectNeeded: IsProjectNeeded;
  existingProjectKey: string;
  projectName: string;
  projectDescription: string;
  projectKey: string;
  projectId: string;
  projectLink: string;
  atlassianId: string;
  sprintsCount: number;
  sprintDuration: number;
  projectStartDate: Date;
  epicsCount: number;
  issuesCount: number;
  issuesTypes: {
    story: boolean;
    bug: boolean;
    task: boolean;
  };
  boardId: number;
  sprintsIds: number[];
  epicsIds: number[];
  issuesResponse: IssueResponse[];
}
