import { GeminiProject } from "../models/gemini/project/gemini-project.model";
import { GeminiSprint } from "../models/gemini/sprint/gemini-sprint.model";
import { GeminiIssue } from "../models/gemini/issue/gemini-issue.model";
import { JiraProjectRequestDTO } from "../models/jira/request/project/jira-project-request.model";
import { JiraSprintRequestDTO } from "../models/jira/request/sprint/jira-sprint-request.model";
import { JiraIssueRequestDTO } from "../models/jira/request/issue/jira-issue-request-dto.model";
import { GeminiEpic } from "../models/gemini/epic/gemini-epic.model";
import { MoveToEpicRequestDTO } from "../models/jira/request/move/move-to-epic.model";
import { JiraIssueResponseDTO } from "../models/jira/response/issue/jira-issue-response-dto.model";
import { MoveToSprintRequestDTO } from "../models/jira/request/move/move-to-sprint.model";
import { JiraSprintResponseDTO } from "../models/jira/response/sprint/jira-sprint-response.model";
import { JiraIssueFieldsRequestDTO } from "../models/jira/request/issue/jira-issue-fields-request-dto.model";

export class JiraRequestDTOMapper {
  static toProjectRequestDto(project: GeminiProject, jiraUserId: string): JiraProjectRequestDTO {
    return {
      assigneeType: 'PROJECT_LEAD',
      description: project.description,
      key: project.key.toUpperCase(),
      leadAccountId: jiraUserId,
      name: project.name,
      projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
      projectTypeKey: 'software',
      url: 'http://jira.com'
    }
  }

  static toSprintsRequestDto(sprints: GeminiSprint[], boardId: number): JiraSprintRequestDTO[] {
    return sprints.map(sprint => {
      return {
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        goal: sprint.goal,
        name: sprint.name,
        originBoardId: boardId
      }
    });
  }

  static toIssueRequestDto(issues: GeminiIssue[] | GeminiEpic[], projectId: string): JiraIssueRequestDTO[] {
    return issues.map(issue => {
      const geminiIdTag = `Treść wygenerowana przez Gemini -> GEMINI_ID: ${issue.geminiId}\n\n`;
      return {
        fields: {
          description: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: geminiIdTag + issue.fields.description
                  }
                ]
              }
            ]
          },
          priority: { id: issue.fields.priority.toString() },
          issuetype: { id: issue.fields.issuetype.toString() },
          summary: issue.fields.summary,
          project: { id: projectId }
        }
      }
    });
  }

  static toMoveIssuesToEpicsRequestDto(
    geminiEpics: GeminiEpic[],
    jiraEpicsRequest: JiraIssueRequestDTO[],
    jiraEpicsResponse: JiraIssueResponseDTO[],
    jiraIssuesRequest: JiraIssueRequestDTO[],
    jiraIssuesResponse: JiraIssueResponseDTO[]
  ): MoveToEpicRequestDTO[] {
    const result: MoveToEpicRequestDTO[] = [];

    for (const geminiEpic of geminiEpics) {
      const geminiEpicId = geminiEpic.geminiId;

      const matchingEpicRequestIndex = jiraEpicsRequest.findIndex((epicRequest) => {
        const extractedId = JiraRequestDTOMapper.getGeminiId(epicRequest.fields.description);
        return extractedId === geminiEpicId;
      });

      const matchingEpicResponse = jiraEpicsResponse[matchingEpicRequestIndex];
      const childGeminiIds = geminiEpic.issuesGeminiIds.map(String);
      const matchingIssueKeys: string[] = [];

      jiraIssuesRequest.forEach((issueReq, index) => {
        const geminiId = JiraRequestDTOMapper.getGeminiId(issueReq.fields.description);
        if (geminiId && childGeminiIds.includes(geminiId)) {
          const issueResponse = jiraIssuesResponse[index];
          if (issueResponse?.key) {
            matchingIssueKeys.push(issueResponse.key);
          }
        }
      });

      result.push({
        id: matchingEpicResponse.id,
        issuesKeys: matchingIssueKeys,
      });
    }

    return result;
  }

  static toMoveIssuesToSprintsRequestDto(
    geminiSprints: GeminiSprint[],
    jiraSprintsRequest: JiraSprintRequestDTO[],
    jiraSprintsResponse: JiraSprintResponseDTO[],
    jiraIssuesRequest: JiraIssueRequestDTO[],
    jiraIssuesResponse: JiraIssueResponseDTO[]
  ): MoveToSprintRequestDTO[] {
    const result: MoveToSprintRequestDTO[] = [];

    for (const geminiSprint of geminiSprints) {
      const matchingSprintRequestIndex = jiraSprintsRequest.findIndex(
        (sprintRequest) =>
          sprintRequest.name === geminiSprint.name &&
          sprintRequest.goal === geminiSprint.goal &&
          sprintRequest.startDate === geminiSprint.startDate &&
          sprintRequest.endDate === geminiSprint.endDate
      );

      const matchingSprintResponse = jiraSprintsResponse[matchingSprintRequestIndex];
      const issueGeminiIds = geminiSprint.issuesGeminiIds.map(String);
      const matchingIssueKeys: string[] = [];

      jiraIssuesRequest.forEach((issueRequest, index) => {
        const geminiId = JiraRequestDTOMapper.getGeminiId(issueRequest.fields.description);
        if (geminiId && issueGeminiIds.includes(geminiId)) {
          const issueResponse = jiraIssuesResponse[index];
          if (issueResponse?.key) {
            matchingIssueKeys.push(issueResponse.key);
          }
        }
      });

      result.push({
        id: matchingSprintResponse.id,
        issuesKeys: matchingIssueKeys,
      });
    }

    return result;
  }


  static getGeminiId(description: JiraIssueFieldsRequestDTO["description"]): string | null {
    try {
      const text = description?.content?.[0]?.content?.[0]?.text ?? "";
      const match = text.match(/GEMINI_ID:\s*([A-Z0-9\-]+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }
}
