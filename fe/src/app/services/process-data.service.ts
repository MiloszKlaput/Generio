import { Injectable } from '@angular/core';
import { RequestData, ResponseData } from '../models/process/process-data.model';
import { MainFormControls } from '../types/main-form-controls.type';
import { DateTime } from 'luxon';
import { Issue } from '../models/issue/issue.model';
import { BehaviorSubject } from 'rxjs';
import { FileData } from '../models/process/file-data.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessDataService {
  requestData!: RequestData;
  responseData!: ResponseData;
  errorMessage$ = new BehaviorSubject<string | null>(null);
  fileData$ = new BehaviorSubject<FileData | null>(null);

  initRequestData(formData: MainFormControls): void {
    this.requestData = {
      atlassianLogin: formData.atlassianLogin.value!,
      atlassianUserId: formData.atlassianUserId.value!,
      atlassianApiKey: formData.atlassianApiKey.value!,
      projectName: formData.projectName.value!,
      projectDescription: formData.projectDescription.value!,
      projectKey: formData.projectKey.value!,
      sprintsCount: formData.sprintsCount.value!,
      sprintDuration: formData.sprintDuration.value!,
      projectStartDate: DateTime.fromJSDate(formData.projectStartDate.value!),
      epicsCount: formData.epicsCount.value!,
      issuesCount: formData.issuesCount.value!,
      issuesTypes: {
        story: formData.issuesTypes.value.story!,
        bug: formData.issuesTypes.value.bug!,
        task: formData.issuesTypes.value.task!
      },
      sprintIssuesAssigment: [],
      issues: []
    };
  }

  initResponseData(): void {
    this.responseData = {
      projectId: '',
      projectLink: '',
      projectKey: '',
      boardId: 0,
      sprints: [],
      epicsIds: [],
      issues: []
    };
  }

  mergeIssues(): Issue[] {
    return this.responseData.issues.map((issueResponse, index) => {
      const issueRequest = this.requestData.issues[index];

      return {
        id: issueResponse.id,
        key: issueResponse.key,
        self: issueResponse.self,
        fields: issueRequest.fields
      } as Issue;
    });
  }
}
