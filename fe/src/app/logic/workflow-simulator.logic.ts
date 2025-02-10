import { DateTime } from "luxon";
import { RequestData, ResponseData } from "../models/process/process-data.model";
import { Issue } from "../models/issue/issue.model";


export class WorkflowSimulator {
  static simulateWorkflowForAllSprints(requestData: RequestData, responseData: ResponseData, issues: Issue[]): void {
    const rejectedChance = 0.05;
    const spilledOverChance = 0.05;

    const sprintsSorted = [...responseData.sprints].sort((a, b) => {
      const startA = DateTime.fromJSDate(a.data.startDate).toMillis();
      const startB = DateTime.fromJSDate(b.data.startDate).toMillis();
      return startA - startB;
    });

    for (let i = 0; i < sprintsSorted.length; i++) {
      const sprint = sprintsSorted[i].data;
      const sprintId = sprint.id;
      const sprintStart = DateTime.fromJSDate(sprint.startDate).startOf('day');
      const sprintEnd = DateTime.fromJSDate(sprint.endDate).startOf('day');

      const assignment = requestData.sprintIssuesAssigment.find(sprint => sprint.id === sprintId);
      if (!assignment) {
        continue;
      }

      const sprintIssues = issues.filter(issue => assignment.issuesKeys.includes(issue.key));

      const nextSprint = sprintsSorted[i + 1] ? sprintsSorted[i + 1].data : null;
      const nextAssignment = nextSprint
        ? requestData.sprintIssuesAssigment.find(sprint => sprint.id === nextSprint.id)
        : null;

      sprintIssues.forEach(issue => {
        if (WorkflowSimulator.getIssueType(issue).toLowerCase() === 'epic') {
          return;
        }

        const isRejected = Math.random() < rejectedChance;
        const isSpilledOver = !isRejected && nextAssignment && Math.random() < spilledOverChance;

        const created = WorkflowSimulator.randomDateBetween(
          sprintStart.minus({ days: 7 }),
          sprintStart
        );

        let updated: DateTime | null = null;
        let status: string;

        if (isRejected) {
          updated = null;
          status = 'Rejected';
        } else if (isSpilledOver) {
          updated = null;
          status = 'In Progress';

          if (!nextAssignment.issuesKeys.includes(issue.fields.key!)) {
            nextAssignment.issuesKeys.push(issue.fields.key!);
          }
        } else {
          updated = WorkflowSimulator.randomDateBetween(created, sprintEnd);
          status = 'Done';
        }

        issue.fields.created = created.toISO()!;
        issue.fields.updated = updated?.toISO() ?? null;
        issue.fields.status = status;
      });
    }
  }

  private static randomDateBetween(start: DateTime, end: DateTime): DateTime {
    const diff = end.diff(start, 'milliseconds').milliseconds;
    if (diff <= 0) {
      return start;
    }
    const offset = Math.floor(Math.random() * diff);
    return start.plus({ milliseconds: offset });
  }

  private static getIssueType(issue: Issue): string {
    return issue.fields.issuetype.id;
  }
}
