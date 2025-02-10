import { RequestData } from "../models/process/process-data.model";
import { FileData, ProjectFileData } from "../models/process/file-data.model";
import { Issue } from "../models/issue/issue.model";

export class FileDataHelper {
  static generateFileData(requestData: RequestData, issues: Issue[]): FileData {
    console.log('requestData: ', requestData);

    const project: ProjectFileData = {
      key: requestData.projectKey,
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

    console.log('project: ', project);
    return { projects: [project] };
  }
}
