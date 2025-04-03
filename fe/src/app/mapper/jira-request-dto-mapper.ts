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

  static toIssueRequestDto(issues: GeminiIssue[] | GeminiEpic[]): JiraIssueRequestDTO[] {
    return issues.map(issue => {
      return {
        fields: {
          created: issue.fields.created,
          description: issue.fields.description,
          issuepriority: issue.fields.issuepriority,
          issuetype: issue.fields.issuetype,
          summary: issue.fields.summary,
          customfield_99999: issue.geminiId
        }
      }
    });
  }

  static toMoveIssuesToEpicsRequestDto(geminiEpics: GeminiEpic[], jiraEpicsRequest: JiraIssueRequestDTO[], jiraEpicsResponse: JiraIssueResponseDTO[], jiraIssuesRequest: JiraIssueRequestDTO[], jiraIssuesResponse: JiraIssueResponseDTO[]): MoveToEpicRequestDTO[] {
    const result: MoveToEpicRequestDTO[] = [];

    for (const geminiEpic of geminiEpics) {
      const geminiEpicId = geminiEpic.geminiId;

      const matchingEpicRequestIndex = jiraEpicsRequest.findIndex((epicReq) => epicReq.fields.customfield_99999 === geminiEpicId);
      const matchingEpicResponse = jiraEpicsResponse[matchingEpicRequestIndex];
      const childGeminiIds = geminiEpic.geminiIssuesIds.map(String);
      const matchingIssueKeys: string[] = [];

      jiraIssuesRequest.forEach((issueReq, idx) => {
        const geminiId = issueReq.fields.customfield_99999;
        if (childGeminiIds.includes(geminiId)) {
          const issueRes = jiraIssuesResponse[idx];
          if (issueRes?.key) {
            matchingIssueKeys.push(issueRes.key);
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

  static toMoveIssuesToSprintsRequestDto(geminiSprints: GeminiSprint[], jiraSprintsRequest: JiraSprintRequestDTO[], jiraSprintsResponse: JiraSprintResponseDTO[], jiraIssuesRequest: JiraIssueRequestDTO[], jiraIssuesResponse: JiraIssueResponseDTO[]): MoveToSprintRequestDTO[] {
    const result: MoveToSprintRequestDTO[] = [];

    for (const geminiSprint of geminiSprints) {
      const matchingSprintRequestIndex = jiraSprintsRequest.findIndex(
        (sprintReq) =>
          sprintReq.name === geminiSprint.name &&
          sprintReq.goal === geminiSprint.goal &&
          sprintReq.startDate === geminiSprint.startDate &&
          sprintReq.endDate === geminiSprint.endDate
      );

      const matchingSprintResponse = jiraSprintsResponse[matchingSprintRequestIndex];
      const issueGeminiIds = geminiSprint.issuesGeminiIds.map(String);
      const matchingIssueKeys: string[] = [];

      jiraIssuesRequest.forEach((issueReq, idx) => {
        const geminiId = issueReq.fields.customfield_99999;
        if (issueGeminiIds.includes(geminiId)) {
          const issueRes = jiraIssuesResponse[idx];
          if (issueRes?.key) {
            matchingIssueKeys.push(issueRes.key);
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
}
