import { IssueType } from "../models/issue/enums/issue-type.enum";
import { Issue } from "../models/issue/issue.model";
import { Project } from "../models/project/project.model";
import { Sprint } from "../models/sprint/sprint.model";

export const project: Project = {
  assigneeType: 'PROJECT_LEAD',
  description: 'Project Created By API Description',
  key: 'CHERRY',
  leadAccountId: '5b10a0effa615349cb016cd8',
  name: 'Project Created By API',
  projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
  projectTypeKey: 'software',
  url: 'http://atlassian.com'
};

export const sprints: Sprint[] = [
  {
    endDate: '2025-01-30T15:22:00.000+10:00',
    goal: 'Sprint 1 goal',
    name: 'Sprint 1',
    originBoardId: 1,
    startDate: '2025-01-01T15:22:00.000+10:00'
  },
  {
    endDate: '2025-02-14T15:22:00.000+10:00',
    goal: 'Sprint 2 goal',
    name: 'Sprint 2',
    originBoardId: 1,
    startDate: '2025-01-31T15:22:00.000+10:00'
  }
];

export const issues: Issue[] = [
  {
    fields: {
      project: { key: 'KIWI' },
      summary: 'Story założone przez API',
      description: {
        content: [
          {
            content: [
              {
                text: 'Przykładowe zadanie założone przez API',
                type: 'text'
              }
            ],
            type: 'paragraph'
          }
        ],
        type: 'doc',
        version: 1
      },
      issuetype: { id: IssueType.Story }
    }
  },
  {
    fields: {
      project: { key: 'KIWI' },
      summary: 'Bug założony przez API2',
      description: {
        content: [
          {
            content: [
              {
                text: 'Przykładowe zadanie założone przez API2',
                type: 'text'
              }
            ],
            type: 'paragraph'
          }
        ],
        type: 'doc',
        version: 1
      },
      issuetype: { id: IssueType.Bug }
    }
  }
];
