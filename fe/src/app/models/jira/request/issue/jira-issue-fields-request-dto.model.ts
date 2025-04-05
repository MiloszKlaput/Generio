export interface JiraIssueFieldsRequestDTO {
  description: {
    content: [
      {
        content: [
          {
            text: string,
            type: "text"
          }
        ],
        type: "paragraph"
      }
    ],
    type: "doc",
    version: 1
  };
  project: { id: string };
  issuetype: { id: string };
  priority: { id: string };
  summary: string;
}
