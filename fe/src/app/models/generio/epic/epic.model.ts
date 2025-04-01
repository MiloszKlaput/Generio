import { Issue } from "../issue/issue.model";

export interface Epic extends Issue {
  issuesIds: number[];
}
