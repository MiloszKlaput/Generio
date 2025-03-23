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
        created: issue.fields.created !== undefined ? issue.fields.created! : '',
        updated: issue.fields.updated !== undefined ? issue.fields.updated! : '',
        customFieldValues: [
          {
            fieldName: "Story Points",
            fieldType: "com.atlassian.jira.plugin.system.customfieldtypes:float",
            value: issue.fields.storyPoints !== undefined ? issue.fields.storyPoints! : 0
          }
        ]
      }))
    };

    return { projects: [project] };
  }

  static async saveToFile(fileData: FileData) {
    const jsonData = JSON.stringify(fileData, null, 2);
    const fileName = 'jiraProjectImport.json';

    if ('showSaveFilePicker' in window) {
      try {
        const options = {
          suggestedName: fileName,
          types: [
            {
              description: 'JSON Files',
              accept: { 'application/json': ['.json'] }
            }
          ]
        };

        const fileHandle = await (window as any).showSaveFilePicker(options);
        const writableStream = await fileHandle.createWritable();
        await writableStream.write(jsonData);
        await writableStream.close();
      } catch (err) {
        console.error('Błąd przy zapisie pliku:', err);
      }
    } else {
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    }
  }

}
