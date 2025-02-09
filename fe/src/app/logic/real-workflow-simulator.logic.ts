import { DateTime } from "luxon";
import { RequestData, ResponseData } from "../models/process/process-data.model";
import { Issue } from "../models/issue/issue.model";

export class RealWorkflowSimulator {
  static simulateWorkflowForAllSprints(requestData: RequestData, responseData: ResponseData): void {
    const rejectedChance = 0.05;
    const spilledOverChance = 0.05;

    const sprintsSorted = [...responseData.sprints].sort((a, b) => {
      const startA = a.data.startDate.toMillis();
      const startB = b.data.startDate.toMillis();
      return startA - startB;
    });

    for (let i = 0; i < sprintsSorted.length; i++) {
      const sprint = sprintsSorted[i].data;
      const sprintId = sprint.id;
      const sprintStart = sprint.startDate.startOf('day');
      const sprintEnd = sprint.endDate.startOf('day');

      const assignment = requestData.sprintIssuesAssigment.find(sprint => sprint.id === sprintId);
      if (!assignment) {
        continue;
      }

      const sprintIssues = requestData.issues.filter(issue =>
        assignment.issuesKeys.includes(issue.fields.key!)
      );

      const nextSprint = sprintsSorted[i + 1].data;
      const nextAssignment = nextSprint
        ? requestData.sprintIssuesAssigment.find(sprint => sprint.id === nextSprint.id)
        : null;

      sprintIssues.forEach(issue => {
        if (RealWorkflowSimulator.getIssueType(issue).toLowerCase() === 'epic') {
          return;
        }

        const isRejected = Math.random() < rejectedChance;
        const isSpilledOver = !isRejected && nextAssignment && Math.random() < spilledOverChance;

        const createdDate = RealWorkflowSimulator.randomDateBetween(
          sprintStart.minus({ days: 7 }),
          sprintStart
        );

        let inProgressDate: DateTime | null = null;
        let resolvedDate: DateTime | null = null;
        let status: string;

        if (isRejected) {
          inProgressDate = RealWorkflowSimulator.randomDateBetween(createdDate, sprintEnd);
          resolvedDate = null;
          status = 'Rejected';
        } else if (isSpilledOver) {
          inProgressDate = RealWorkflowSimulator.randomDateBetween(createdDate, sprintEnd);
          resolvedDate = null;
          status = 'In Progress';

          if (!nextAssignment!.issuesKeys.includes(issue.fields.key!)) {
            nextAssignment!.issuesKeys.push(issue.fields.key!);
          }
        } else {
          inProgressDate = RealWorkflowSimulator.randomDateBetween(createdDate, sprintEnd);
          resolvedDate = RealWorkflowSimulator.randomDateBetween(inProgressDate, sprintEnd);
          status = 'Done';
        }

        issue.fields.createdDate = createdDate.toISO()!;
        issue.fields.inProgressDate = inProgressDate?.toISO() ?? null;
        issue.fields.resolvedDate = resolvedDate?.toISO() ?? null;
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
