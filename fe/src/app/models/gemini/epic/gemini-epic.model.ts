import { GeminiIssue} from "../issue/gemini-issue.model";

export interface GeminiEpic extends GeminiIssue {
  issuesGeminiIds: string[];
}
