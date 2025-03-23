import { DateTime } from "luxon";
import { RequestData, ResponseData } from "../models/process/process-data.model";
import { Issue } from "../models/issue/issue.model";


export class WorkflowSimulator {
  static storyPointsCollection = [1, 2, 3, 5, 8, 13];
  static scrumTeamMembers = 7;
  static scrumTeamMemberMaximumVelocity = 10;
  static sprintCapacity = WorkflowSimulator.scrumTeamMembers * WorkflowSimulator.scrumTeamMemberMaximumVelocity;
  static maxCarryOverStoryPoints = WorkflowSimulator.sprintCapacity * 0.2;

  static simulateSprintWorkflow(requestData: RequestData, responseData: ResponseData, issues: Issue[]): { [key: string]: { sprintId: number, issues: Issue[] } } {
    const projectStartDate = requestData.projectStartDate;
    const sprintDuration = requestData.sprintDuration;
    const sprintsCount = requestData.sprintsCount;
    const sprints = responseData.sprints;

    const shuffledIssues = issues.sort(() => Math.random() - 0.5);
    const sprintAssignments: { [key: string]: { sprintId: number, issues: Issue[] } } = {};
    let remainingIssues = [...shuffledIssues];
    let sprintStartDate = projectStartDate;
    let carryOverIssues: Issue[] = [];
    const today = DateTime.now();

    for (let sprint = 0; sprint < sprintsCount; sprint++) {
      let sprintCapacity = WorkflowSimulator.sprintCapacity;
      let sprintIssues: Issue[] = [];

      const carryOverStoryPoints = carryOverIssues.reduce((sum, issue) => sum + (issue.fields.storyPoints || 0), 0);
      sprintCapacity -= carryOverStoryPoints;

      sprintAssignments[sprint.toString()] = { sprintId: sprints[sprint].data.id, issues: [] };

      const sprintEndDate = sprintStartDate.plus({ days: sprintDuration });
      const isClosed = sprintEndDate.startOf('day') < today.startOf('day');
      const isActive = sprintStartDate.startOf('day') <= today.startOf('day') && sprintEndDate.startOf('day') > today.startOf('day');
      const isFuture = sprintStartDate.startOf('day') > today.startOf('day');
      const daysUntilSprintEnd = sprintEndDate.diff(today, 'days').days;

      for (const issue of carryOverIssues) {
        issue.fields.status = "Done";
        issue.fields.resolution = "Done";
        issue.fields.updated = sprintEndDate.toISO()?.toString(); // do zmiany
        sprintAssignments[sprint.toString()].issues.push(issue);
      }
      carryOverIssues = [];

      while (remainingIssues.length > 0 && sprintCapacity > 0) {
        const randomIndex = Math.floor(Math.random() * remainingIssues.length);
        const currentIssue = remainingIssues[randomIndex];
        const storyPoints = this.getRandomStoryPoints();

        if (sprintCapacity >= storyPoints) {
          currentIssue.fields.storyPoints = storyPoints;

          // 80% zadań założonych przed rozpoczęciem sprintu
          const createdBeforeSprint = Math.random() < 0.8;
          const createdDate = createdBeforeSprint
            ? this.randomDateBetween(sprintStartDate.minus({ days: sprintDuration }), sprintStartDate).toISO()?.toString()
            // -3 dni od końca sprintu
            : this.randomDateBetween(sprintStartDate, sprintEndDate.plus({ days: 3 })).toISO()?.toString();
          currentIssue.fields.created = createdDate;

          if (isClosed) {
            const completionProbability = this.calculateCompletionProbability(storyPoints, 0.7);

            if (Math.random() < completionProbability) {
              currentIssue.fields.status = "Done";
              currentIssue.fields.resolution = "Done";
              currentIssue.fields.updated = this.randomDateBasedOnProbability(sprintEndDate, 0.9 + storyPoints * 0.02).toISO()?.toString();
            } else {
              currentIssue.fields.status = "In Progress";
              currentIssue.fields.resolution = undefined;
              currentIssue.fields.updated = this.randomDateBasedOnProbability(sprintStartDate, 0.3 + storyPoints * 0.02).toISO()?.toString();
              carryOverIssues.push(currentIssue);
            }
          }

          if (isActive) {
            const sprintProgress = (sprintDuration - daysUntilSprintEnd) / sprintDuration;
            const completionProbability = Math.max(0, sprintProgress);

            if (Math.random() < completionProbability) {
              currentIssue.fields.status = "Done";
              currentIssue.fields.resolution = "Done";
              currentIssue.fields.updated = this.randomDateBasedOnProbability(sprintEndDate, 0.7 + storyPoints * 0.02 + sprintProgress * 0.3).toISO()?.toString();
            } else if (Math.random() < sprintProgress * 0.7) {
              currentIssue.fields.status = "In Progress";
              currentIssue.fields.resolution = undefined;
              currentIssue.fields.updated = this.randomDateBasedOnProbability(today, 0.5 + sprintProgress * 0.4).toISO()?.toString();
              carryOverIssues.push(currentIssue);
            } else {
              currentIssue.fields.status = "To Do";
              currentIssue.fields.resolution = undefined;
              currentIssue.fields.updated = createdDate;
            }
          }

          if (isFuture) {
            currentIssue.fields.status = "To Do";
            currentIssue.fields.updated = createdDate;
            currentIssue.fields.resolution = undefined;
          }

          sprintAssignments[sprint.toString()].issues.push(currentIssue);
          sprintCapacity -= storyPoints;
          sprintIssues.push(currentIssue);
          remainingIssues.splice(randomIndex, 1);
        } else {
          break;
        }
      }

      // spady 0-10%
      const maxCarryOverIssues = Math.floor(sprintIssues.length * 0.1);
      carryOverIssues = sprintIssues.slice(0, maxCarryOverIssues);

      // spady ustawiane na In progress
      for (const issue of carryOverIssues) {
        issue.fields.status = "In Progress";
        issue.fields.resolution = undefined;
      }

      sprintStartDate = sprintEndDate;
    }

    return sprintAssignments;
  }

  private static randomDateBetween(start: DateTime, end: DateTime): DateTime {
    const diff = end.diff(start, 'milliseconds').milliseconds;
    if (diff <= 0) {
      return start;
    }

    const offset = Math.floor(Math.random() * diff);
    return start.plus({ milliseconds: offset });
  }

  static randomDateBasedOnProbability(endDate: DateTime, probability: number): DateTime {
    const daysOffset = Math.floor(probability * endDate.diff(DateTime.now(), 'days').days);
    return DateTime.now().plus({ days: daysOffset });
  }

  static calculateCompletionProbability(storyPoints: number, baseProbability: number): number {
    const penalty = storyPoints * 0.03;
    return Math.max(0.1, baseProbability - penalty);
  }

  private static getRandomStoryPoints(): number {
    const randomIndex = Math.floor(Math.random() * WorkflowSimulator.storyPointsCollection.length);
    return WorkflowSimulator.storyPointsCollection[randomIndex];
  }
}
