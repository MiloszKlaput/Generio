
import { JiraUserInfo } from "../jira-user-info/jira-user-info.model";
import { Board } from "../board/board.model";
import { Epic } from "../epic/epic.model";
import { Issue } from "../issue/issue.model";
import { Project } from "../project/project.model";
import { Sprint } from "../sprint/sprint.model";

export interface ProcessData {
  jiraUserInfo: JiraUserInfo | null;
  project: Project | null;
  board: Board | null;
  epics: Epic[];
  issues: Issue[];
  sprints: Sprint[];
}
