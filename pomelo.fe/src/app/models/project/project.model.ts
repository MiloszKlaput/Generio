export interface ProjectRequest {
  assigneeType: string;
  description: string;
  key: string;
  leadAccountId: string;
  name: string;
  projectTemplateKey: string;
  projectTypeKey: string;
  url: string;
}

export interface ProjectResponse {
  data: {
    id: string,
    key: string,
    self: string
  }
}
