import { inject, Injectable } from '@angular/core';
import { JiraApiService } from './jira-api.service';
import { RequestBuilder } from '../logic/request-builder.logic';
import { ProjectRequest, ProjectResponse } from '../models/project/project.model';
import { SprintRequest, SprintResponse } from '../models/sprint/sprint.model';
import { IssuesRequest, IssuesResponse } from '../models/issue/issue.model';
import { DateTime } from 'luxon';
import { MainFormControls } from '../types/main-form-controls.type';
import { RequestData, ResponseData } from '../models/process/process-data.model';
import { IsProjectNeeded } from '../enums/is-project-needed.enum';
import { concatMap, from } from 'rxjs';
import { MoveToEpicRequest } from '../models/issue/move-to-epic.model';
import { MoveToSprintRequest } from '../models/issue/move-to-sprint.model';

@Injectable({
  providedIn: 'root'
})
export class JiraPopulateProcessService {
  private apiService = inject(JiraApiService);
  private requestData!: RequestData;
  private responseData!: ResponseData;

  startProcess(mainFormData: MainFormControls): void {
    this.mapToRequestData(mainFormData);

    const isNewProjectNeeded = this.requestData.isProjectNeeded;

    if (isNewProjectNeeded === IsProjectNeeded.Yes) {
      const newProjectData: ProjectRequest = RequestBuilder.buildProjectRequest(mainFormData);
      this.apiService.createProject(newProjectData)
        .subscribe((newProjectResponse: ProjectResponse) => {
          if (newProjectResponse) {
            this.responseData.projectId = newProjectResponse.data.id;
            this.responseData.projectLink = newProjectResponse.data.self;
            this.responseData.projectKey = newProjectResponse.data.key;

            this.continueProcess(mainFormData);
          }
        });
    } else {
      this.continueProcess(mainFormData);
    }
  }

  private continueProcess(mainFormData: MainFormControls): void {
    const projectKey = this.requestData.projectKey.length > 0 ? this.requestData.projectKey : this.requestData.existingProjectKey;

    this.apiService.getBoardId(projectKey)
      .subscribe((boardId: { data: number }) => {
        if (boardId) {
          this.responseData.boardId = boardId.data;

          const sprintsData: SprintRequest[] = RequestBuilder.buildSprintsRequest(mainFormData, this.responseData.boardId);
          from(sprintsData)
            .pipe(
              concatMap((sprintData: SprintRequest) => this.apiService.createSprint(sprintData))
            )
            .subscribe((sprintResponse: SprintResponse) => {
              if (sprintResponse) {
                this.responseData.sprints.push(sprintResponse);

                const projectKey = this.responseData.projectKey ? this.responseData.projectKey : this.requestData.existingProjectKey;
                const epicsData: IssuesRequest[] = RequestBuilder.buildEpicsRequest(mainFormData, projectKey);

                this.apiService.createIssues(epicsData)
                  .subscribe((epicsResponse: IssuesResponse) => {
                    if (epicsResponse) {
                      for (let epic of epicsResponse.data.issues) {
                        this.responseData.epicsIds.push(epic.id);
                      }

                      const issuesData: IssuesRequest[] = RequestBuilder.buildIssuesRequest(mainFormData, projectKey);
                      this.apiService.createIssues(issuesData)
                        .subscribe((issuesResponse: IssuesResponse) => {
                          if (issuesResponse) {
                            this.responseData.issues = issuesResponse.data.issues;

                            const moveToEpicData = RequestBuilder.buildMoveToEpicRequest(this.responseData.epicsIds, this.responseData.issues);

                            from(moveToEpicData)
                              .pipe(
                                concatMap((moveToEpicData: MoveToEpicRequest) => this.apiService.moveIssuesToEpic(moveToEpicData))
                              )
                              .subscribe(() => {
                                const sprintsIds = this.responseData.sprints.map(sprint => sprint.data.id);
                                const moveToSprintData = RequestBuilder.buildMoveToSprintRequest(sprintsIds, this.responseData.issues);
                                this.responseData.sprintIssuesAssigment = moveToSprintData;

                                from(moveToSprintData)
                                  .pipe(
                                    concatMap((moveToSprintData: MoveToSprintRequest) => this.apiService.moveIssuesToSprint(moveToSprintData))
                                  )
                                  .subscribe(() => {
                                    if (DateTime.fromJSDate(this.requestData.projectStartDate).startOf('day') < DateTime.now().startOf('day')) {
                                      // TO DO - obsługa projektu w przeszłości

                                    }
                                  });
                              });
                          }
                        });
                    }
                  });
              }
            });
        }
      });
  }

  private mapToRequestData(mainFormData: MainFormControls) {
    this.requestData = {
      isProjectNeeded: mainFormData.isProjectNeeded.value!,
      existingProjectKey: mainFormData.existingProjectKey.value!,
      projectName: mainFormData.projectName.value!,
      projectDescription: mainFormData.projectDescription.value!,
      projectKey: mainFormData.projectKey.value!,
      atlassianId: mainFormData.atlassianId.value!,
      sprintsCount: mainFormData.sprintsCount.value!,
      sprintDuration: mainFormData.sprintDuration.value!,
      projectStartDate: mainFormData.projectStartDate.value!,
      epicsCount: mainFormData.epicsCount.value!,
      issuesCount: mainFormData.issuesCount.value!,
      issuesTypes: {
        story: mainFormData.issuesTypes.value.story!,
        bug: mainFormData.issuesTypes.value.bug!,
        task: mainFormData.issuesTypes.value.task!
      }
    };
  }
}
