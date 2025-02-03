import { IssuePriority } from "../models/issue/enums/issue-priority.enum";
import { IssueType } from "../models/issue/enums/issue-type.enum";
import { IssuesRequest } from "../models/issue/issue.model";
import { ProjectRequest } from "../models/project/project.model";
import { SprintRequest } from "../models/sprint/sprint.model";
import { MainFormControls } from "../types/main-form-controls.type";
import { DateTime } from 'luxon';

export class RequestBuilder {
  static buildProjectRequest(f: MainFormControls): ProjectRequest {
    return {
      assigneeType: 'PROJECT_LEAD',
      description: f.projectDescription.value!,
      key: f.projectKey.value!,
      leadAccountId: f.atlassianId.value!,
      name: f.projectName.value!,
      projectTemplateKey: 'com.pyxis.greenhopper.jira:gh-simplified-scrum-classic',
      projectTypeKey: 'software',
      url: 'http://atlassian.com'
    }
  }

  static buildSprintsRequest(f: MainFormControls, boardId: number): SprintRequest[] {
    const result: SprintRequest[] = [];
    const sprintsCount = f.sprintsCount.value!;
    const duration = f.sprintDuration.value!;
    let sprintStartDate = 0;

    for (let index = 1; index <= sprintsCount; index++) {
      const sprintData: SprintRequest = {
        originBoardId: boardId,
        name: `Sprint ${index}`,
        goal: `Cel sprintu ${index}`,
        startDate: DateTime.fromJSDate(f.projectStartDate.value!).plus({ days: sprintStartDate }).toISO()!,
        endDate: DateTime.fromJSDate(f.projectStartDate.value!).plus({ days: sprintStartDate + duration }).toISO()!
      };

      sprintStartDate += duration;

      result.push(sprintData);
    }

    return result;
  }

  static buildEpicsRequest(f: MainFormControls, projectKey: string): IssuesRequest[] {
    const result: IssuesRequest[] = [];
    const epicsCount = f.epicsCount.value!;

    for (let i = 1; i <= epicsCount; i++) {
      result.push(this.createIssue(projectKey, `Tytuł epiki ${i}`, IssueType.Epik, null));
    }

    return result;
  }

  static buildIssuesRequest(f: MainFormControls, projectKey: string): IssuesRequest[] {
    const result: IssuesRequest[] = [];
    const issuesCount = f.issuesCount.value!;
    const issuesPriority = [50000, 40000, 30000, 20000, 10000];
    const issueTypeWeights = { story: 0.6, bug: 0.3, task: 0.1 };

    let storyCount = Math.floor(issuesCount * issueTypeWeights.story);
    let bugCount = Math.floor(issuesCount * issueTypeWeights.bug);
    let taskCount = Math.floor(issuesCount * issueTypeWeights.task);

    storyCount += issuesCount - (storyCount + bugCount + taskCount);

    const issueTypes: { type: IssueType; count: number }[] = [
      { type: IssueType.Story, count: storyCount },
      { type: IssueType.Bug, count: bugCount },
      { type: IssueType.Task, count: taskCount }
    ];

    for (let i = 1; i <= issuesCount; i++) {
      const issueTypeObject = issueTypes.find(t => t.count > 0)!;

      result.push(this.createIssue(projectKey, `Tytuł zadania ${i}`, issueTypeObject.type, this.getRandomPriority(issuesPriority)));

      issueTypeObject.count--;
    }

    return result;
  }

  static buildMoveToEpicRequest() { }

  static buildMoveToSprintRequest() { }

  private static createIssue(projectKey: string, summary: string, issueType: IssueType, priority: IssuePriority | null): IssuesRequest {
    return {
      fields: {
        project: { key: projectKey },
        summary,
        issuetype: { id: issueType },
        priority: issueType !== IssueType.Epik ? priority : null,
        description: {
          content: [
            {
              content: [
                {
                  text: 'Zadanie założone przez API',
                  type: 'text'
                }
              ],
              type: 'paragraph'
            }
          ],
          type: 'doc',
          version: 1
        },
        customfield_10016: 0
      }
    };
  }

  private static getRandomPriority(priorities: number[]): IssuePriority {
    return priorities[Math.floor(Math.random() * priorities.length)] as IssuePriority;
  }
}
