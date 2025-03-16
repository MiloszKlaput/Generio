import { DateTime } from "luxon";
import { RequestData, ResponseData } from "../models/process/process-data.model";
import { Issue } from "../models/issue/issue.model";


export class WorkflowSimulator {
  static simulateBusinessWorkflow(requestData: RequestData, responseData: ResponseData, issues: Issue[]): void {
    const rejectedChance = 0.05;
    const spilledOverChance = 0.05;

    const sprintsSorted = [...responseData.sprints].sort((a, b) => {
      const startA = DateTime.fromISO(a.data.startDate).toMillis();
      const startB = DateTime.fromISO(b.data.startDate).toMillis();
      return startA - startB;
    });

    for (let i = 0; i < sprintsSorted.length; i++) {
      const sprint = sprintsSorted[i].data;
      const sprintId = sprint.id;
      const sprintStart = DateTime.fromISO(sprint.startDate).startOf('day');
      const sprintEnd = DateTime.fromISO(sprint.endDate).startOf('day');

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
        let resolution: string | null = null;
        let status: string;

        if (isRejected) {
          updated = null;
          status = 'Rejected';
          resolution = 'Rejected';
        } else if (isSpilledOver) {
          status = 'In Progress';

          if (!nextAssignment.issuesKeys.includes(issue.fields.key!)) {
            nextAssignment.issuesKeys.push(issue.fields.key!);
          }
        } else {
          updated = WorkflowSimulator.randomDateBetween(created, sprintEnd);
          status = 'Done';
          resolution = 'Resolved';
        }

        issue.fields.created = created.toISO()!;
        issue.fields.updated = updated?.toISO() ?? null;
        issue.fields.status = status;
        issue.fields.resolution = resolution!;
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
