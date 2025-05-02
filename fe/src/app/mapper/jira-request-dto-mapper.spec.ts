import { IssuePriorityEnum } from "../enums/issue-priority.enum";
import { IssueTypeEnum } from "../enums/issue-type.enum";
import { GeminiEpic } from "../models/gemini/epic/gemini-epic.model";
import { GeminiIssue } from "../models/gemini/issue/gemini-issue.model";
import { GeminiProject } from "../models/gemini/project/gemini-project.model";
import { GeminiSprint } from "../models/gemini/sprint/gemini-sprint.model";
import { JiraIssueRequestDTO } from "../models/jira/request/issue/jira-issue-request-dto.model";
import { MoveToEpicRequestDTO } from "../models/jira/request/move/move-to-epic.model";
import { MoveToSprintRequestDTO } from "../models/jira/request/move/move-to-sprint.model";
import { JiraSprintRequestDTO } from "../models/jira/request/sprint/jira-sprint-request.model";
import { JiraIssueResponseDTO } from "../models/jira/response/issue/jira-issue-response-dto.model";
import { JiraSprintResponseDTO } from "../models/jira/response/sprint/jira-sprint-response.model";
import { JiraRequestDTOMapper } from "./jira-request-dto-mapper";


describe('JiraRequestDTOMapper', () => {
  it('should map GeminiProject to JiraProjectRequestDTO correctly', () => {
    const project: GeminiProject = {
      description: 'desc',
      key: 'abc',
      name: 'My Project'
    };

    const dto = JiraRequestDTOMapper.toProjectRequestDto(project, 'user-123');

    // Data from Gemini
    expect(dto.description).toBe('desc');
    expect(dto.key).toBe('ABC');
    expect(dto.name).toBe('My Project');

    // Data from "constructor"
    expect(dto.assigneeType).toBe('PROJECT_LEAD');
    expect(dto.projectTemplateKey).toBe('com.pyxis.greenhopper.jira:gh-simplified-scrum-classic');
    expect(dto.projectTypeKey).toBe('software');

    // Data from parameter
    expect(dto.leadAccountId).toBe('user-123');
  });

  it('should map GeminiSprint[] to JiraSprintRequestDTO[]', () => {
    const sprints: GeminiSprint[] = [
      {
        issuesGeminiIds: [],
        name: 'Sprint 1',
        goal: 'goal1',
        startDate: '2023-01-01',
        endDate: '2023-01-10'
      },
      {
        issuesGeminiIds: [],
        name: 'Sprint 2',
        goal: 'goal2',
        startDate: '2024-01-01',
        endDate: '2024-01-10'
      },
    ];

    const dto = JiraRequestDTOMapper.toSprintsRequestDto(sprints, 1001);

    // Check if length is correct
    expect(dto).toHaveSize(2);

    // Data from parameter
    expect(dto[0].originBoardId).toBe(1001);
    expect(dto[1].originBoardId).toBe(1001);

    // Data from Gemini for 1st sprint
    expect(dto[0].name).toBe('Sprint 1');
    expect(dto[0].goal).toBe('goal1');
    expect(dto[0].startDate).toBe('2023-01-01');
    expect(dto[0].endDate).toBe('2023-01-10');

    // Data from Gemini for 2nd sprint
    expect(dto[1].name).toBe('Sprint 2');
    expect(dto[1].goal).toBe('goal2');
    expect(dto[1].startDate).toBe('2024-01-01');
    expect(dto[1].endDate).toBe('2024-01-10');
  });

  it('should map GeminiIssue[] to JiraIssueRequestDTO[]', () => {
    const issues: GeminiIssue[] = [
      {
        geminiId: 'ABC-123',
        id: 1000,
        key: 'DEF-456',
        fields: {
          description: 'Some description1',
          priority: IssuePriorityEnum.Highest,
          issuetype: IssueTypeEnum.Epic,
          summary: 'Summary1'
        }
      },
      {
        geminiId: 'XYZ-123',
        id: 2000,
        key: 'QWE-456',
        fields: {
          description: 'Some description2',
          priority: IssuePriorityEnum.Medium,
          issuetype: IssueTypeEnum.Bug,
          summary: 'Summary2'
        }
      }
    ];

    const dto = JiraRequestDTOMapper.toIssueRequestDto(issues, '1234');

    // Check if length is correct
    expect(dto).toHaveSize(2);

    // Data from parameter
    expect(dto[0].fields.project.id).toBe('1234');
    expect(dto[1].fields.project.id).toBe('1234');

    // Data from Gemini for epic
    expect(dto[0].fields.description.content[0].content[0].text).toContain('Some description1');
    expect(dto[0].fields.issuetype.id).toContain(IssueTypeEnum.Epic.toString());
    expect(dto[0].fields.priority.id).toContain(IssuePriorityEnum.Highest.toString());
    expect(dto[0].fields.summary).toBe('Summary1');

    // Data from Gemini for bug
    expect(dto[1].fields.description.content[0].content[0].text).toContain('Some description2');
    expect(dto[1].fields.issuetype.id).toContain(IssueTypeEnum.Bug.toString());
    expect(dto[1].fields.priority.id).toContain(IssuePriorityEnum.Medium.toString());
    expect(dto[1].fields.summary).toBe('Summary2');
  });

  it('should extract geminiId from description text', () => {
    const description = {
      content: [{
        content: [{
          text: 'Treść wygenerowana przez Gemini -> GEMINI_ID: ABC-123\n\nSome text'
        }]
      }]
    };

    const geminiId = JiraRequestDTOMapper.getGeminiId(description as any);
    expect(geminiId).toBe('ABC-123');
  });

  it('should return null for invalid geminiId description', () => {
    const description = { content: [{ content: [{ text: 'No GEMINI_ID here' }] }] };
    expect(JiraRequestDTOMapper.getGeminiId(description as any)).toBeNull();
  });

  it('should map issues to epics based on geminiId match', () => {
    const epics: GeminiEpic[] = [{
      geminiId: 'ABC-123',
      issuesGeminiIds: ['DEF-123']
    }] as any;

    const requestEpics: JiraIssueRequestDTO[] = [{
      fields: {
        description: {
          content: [
            {
              content: [
                {
                  text: 'GEMINI_ID: ABC-123',
                }
              ],
            }
          ],
        }
      }
    }] as any;

    const responseEpics: JiraIssueResponseDTO[] = [
      {
        key: 'EPIC-1',
        id: 1,
        self: ''
      }
    ];

    const requestIssues: JiraIssueRequestDTO[] = [{
      fields: {
        description: {
          content: [
            {
              content: [
                {
                  text: 'GEMINI_ID: DEF-123',
                }
              ]
            }
          ]
        }
      }
    }] as any;

    const responseIssues: JiraIssueResponseDTO[] = [{ key: 'ISSUE-1' }] as any;
    const result: MoveToEpicRequestDTO[] = JiraRequestDTOMapper.toMoveIssuesToEpicsRequestDto(epics, requestEpics, responseEpics, requestIssues, responseIssues) as any;

    expect(result[0].issuesKeys[0]).toBe('ISSUE-1');
  });

  it('should map issues to sprints based on geminiId match', () => {
    const sprints: GeminiSprint[] = [{
      name: 'Sprint 1',
      goal: 'goal1',
      startDate: '2024-01-01',
      endDate: '2024-01-10',
      issuesGeminiIds: ['DEF-123']
    }];

    const sprintRequest: JiraSprintRequestDTO[] = [{
      name: 'Sprint 1',
      goal: 'goal1',
      startDate: '2024-01-01',
      endDate: '2024-01-10',
      originBoardId: 1000
    }];

    const sprintResponse: JiraSprintResponseDTO[] = [{ id: 321 }] as any;

    const requestIssues: JiraIssueRequestDTO[] = [{
      fields: {
        description: {
          content: [
            {
              content: [
                {
                  text: 'GEMINI_ID: DEF-123',
                }
              ],
            }
          ],
        }
      }
    }] as any;

    const responseIssues: JiraIssueResponseDTO[] = [
      {
        key: 'ISSUE-1',
        id: 2,
        self: ''
      }
    ]

    const result: MoveToSprintRequestDTO[] = JiraRequestDTOMapper.toMoveIssuesToSprintsRequestDto(sprints, sprintRequest, sprintResponse, requestIssues, responseIssues) as any;

    expect(result[0].issuesKeys[0]).toBe('ISSUE-1');
  });
});
