export interface FileData {
  projects: ProjectFileData[];
}

export interface ProjectFileData {
  name: string;
  key: string;
  description: string;
  issues: IssueFileData[];
}

export interface IssueFileData {
  externalId: number;
  key: string;
  summary: string;
  issueType: string;
  status: string;
  created: string;
  updated: string;
  resolution: string;
}
