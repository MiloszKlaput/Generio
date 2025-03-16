import { DateTime } from "luxon";
import { RequestData, ResponseData } from "../models/process/process-data.model";
import { Issue } from "../models/issue/issue.model";


export class WorkflowSimulator {
  static simulateBusinessWorkflow(requestData: RequestData, responseData: ResponseData, issues: Issue[]): void {
    const scrumTeamVelocity = 70;
    // dorzucamy do sprintu?
    // wyrzycamy ze sprintu?
    // spady z poprzedniego sprintu
    const prevSprintDrop = 0;

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
