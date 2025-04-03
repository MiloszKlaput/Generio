import { GeminiEpic } from "./epic/gemini-epic.model";
import { GeminiIssue } from "./issue/gemini-issue.model";
import { GeminiProject } from "./project/gemini-project.model";
import { GeminiSprint } from "./sprint/gemini-sprint.model";

export interface GeminiResponse {
  project: GeminiProject;
  epics: GeminiEpic[];
  issues: GeminiIssue[];
  sprints: GeminiSprint[];
}
