import { RequestData } from "../models/process/process-data.model";
import { FileData, ProjectFileData } from "../models/process/file-data.model";
import { Issue } from "../models/issue/issue.model";

export class FileHelper {
  static createFileData(requestData: RequestData, issues: Issue[]): FileData {
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

    return { projects: [project] };
  }

  static formatCsvFileData(fileData: FileData): string {
    const headers = [
      "projectKey",
      "externalId",
      "issueKey",
      "summary",
      "issueType",
      "status",
      "created",
      "updated",
      "resolution"
    ];

    let csv = headers.join(",") + "\n";

    fileData.projects.forEach(project => {
      const projectKey = project.key;
      project.issues.forEach(issue => {
        const row = [
          projectKey,
          issue.externalId,
          issue.key,
          issue.summary,
          issue.issueType,
          issue.status,
          issue.created,
          issue.updated,
          issue.resolution
        ]
          .map(value => {
            if (value === null || value === undefined) {
              return "";
            }

            if (typeof value === 'string') {
              let escaped = value.replace(/"/g, '""');
              if (escaped.search(/("|,|\n)/g) >= 0) {
                escaped = `"${escaped}"`;
              }
              return escaped;
            }
            return value.toString();
          })
          .join(",");

        csv += row + "\n";
      });
    });

    return csv;
  }

  static async saveToFile(csvFileData: string) {
    if ('showSaveFilePicker' in window) {
      try {
        const options = {
          suggestedName: 'jiraProjectImport.csv',
          types: [
            {
              description: 'CSV Files',
              accept: { 'text/csv': ['.csv'] }
            }
          ]
        };

        const fileHandle = await (window as any).showSaveFilePicker(options);
        const writableStream = await fileHandle.createWritable();
        await writableStream.write(csvFileData);
        await writableStream.close();
      } catch (err) {
        console.error(err);
      }
    } else {
      const blob = new Blob([csvFileData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'jiraProjectImport.csv';
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }
}
