import { RequestData, ResponseData } from "../models/process/process-data.model";
import { FileData, ProjectFileData } from "../models/process/file-data.model";
import { Issue } from "../models/issue/issue.model";

export class FileDataHelper {
  static generateFileData(requestData: RequestData, issues: Issue[]): FileData {
    const project: ProjectFileData = {
      name: requestData.projectName,
      key: requestData.projectKey,
      description: requestData.projectDescription,
      issues: issues.map(issue => ({
        externalId: issue.id !== undefined ? issue.id : 0,
        key: issue.key !== undefined ? issue.key : '',
        summary: issue.fields.summary,
        issueType: issue.fields.issuetype ? issue.fields.issuetype.id : '',
        status: issue.fields.status !== undefined ? issue.fields.status : '',
        resolution: issue.fields.status !== undefined ? issue.fields.resolution! : '',
        created: issue.fields.created !== undefined ? issue.fields.created : '',
        updated: issue.fields.updated !== undefined ? issue.fields.updated! : ''
      }))
    };

    return { projects: [project] };
  }
}
