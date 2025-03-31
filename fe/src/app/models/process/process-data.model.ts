import { AtlassianUserInfo } from "../atlassian-user-info/atlassian-user-info.model";
import { Board } from "../board/board.model";
import { Epic } from "../epic/epic.model";
import { Issue } from "../issue/issue.model";
import { Project } from "../project/project.model";
import { Sprint } from "../sprint/sprint.model";

export interface ProcessData {
  atlassianUserInfo?: AtlassianUserInfo;
  project?: Project;
  board?: Board;
  epics: Epic[];
  issues: Issue[];
  sprints: Sprint[];
}
