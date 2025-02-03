import { inject, Injectable } from '@angular/core';
import { JiraDataService } from './jira-data.service';
import { JiraApiService } from './jira-api.service';
import { RequestBuilder } from '../logic/request-builder.logic';
import { ProjectRequest, ProjectResponse } from '../models/project/project.model';
import { SprintRequest, SprintResponse } from '../models/sprint/sprint.model';
import { IssuesRequest, IssuesResponse } from '../models/issue/issue.model';
import { DateTime } from 'luxon';
import { MainFormControls } from '../types/main-form-controls.type';
import { ProcessData } from '../models/process/process-data.model';

@Injectable({
  providedIn: 'root'
})
export class JiraPopulateProcessService {
  private dataService = inject(JiraDataService);
  private apiService = inject(JiraApiService);

  private processData!: ProcessData;

  startProcess(mainFormData: MainFormControls): void {
    this.buildProcessData(mainFormData);
    this.dataService.setProcessData(this.processData);

    const isNewProjectNeeded = this.processData.isProjectNeeded;
    if (isNewProjectNeeded) {
      const newProjectData: ProjectRequest = RequestBuilder.buildProjectRequest(mainFormData);
      this.apiService.createProject(newProjectData)
        .subscribe((newProjectData: ProjectResponse) => {
          if (newProjectData) {
            this.processData.projectId = newProjectData.id;
            this.processData.projectLink = newProjectData.self;

            this.dataService.setProcessData(this.processData);

            this.continueProcess(mainFormData, newProjectData);
          }
        });
    } else {
      this.continueProcess(mainFormData);
    }
  }

  private continueProcess(mainFormData: MainFormControls, newProjectData?: any): void {
    this.apiService.getBoardId()
      .subscribe((boardId: number) => {
        if (boardId) {
          this.processData.boardId = boardId;

          const sprintsData: SprintRequest[] = RequestBuilder.buildSprintsRequest(mainFormData, boardId);
          for (const sprintData of sprintsData) {
            this.apiService.createSprint(sprintData)
              .subscribe((sprintResponse: SprintResponse) => {
                if (sprintResponse) {
                  this.processData.sprintsIds.push(sprintResponse.id);
                }
              });
          }

          const projectKey = this.processData.projectKey ? this.processData.projectKey : this.processData.existingProjectKey;
          const epicsData: IssuesRequest[] = RequestBuilder.buildEpicsRequest(mainFormData, projectKey);

          this.apiService.createIssues(epicsData)
            .subscribe((epicsResponse: IssuesResponse) => {
              if (epicsResponse) {
                for (const epic of epicsResponse.issues) {
                  this.processData.epicsIds.push(epic.id);
                }

                const issuesData: IssuesRequest[] = RequestBuilder.buildEpicsRequest(mainFormData, projectKey);
                this.apiService.createIssues(issuesData)
                  .subscribe((issuesResponse: IssuesResponse) => {
                    if (issuesResponse) {
                      this.processData.issuesResponse = issuesResponse.issues;
                      // przetestowac co na prawde to zwraca, czy sa tu fields
                      // jezeli nie to sciagnac wszystkie issues
                      // napisac funkcje ktora sprawdza cos w stylu "story point"




                      // 5. Przenieś zadania do epik
                      const moveToEpicData = RequestBuilder.buildMoveToEpicRequest();
                      const epicsIds = 0; // Zwrotka z createIssues


                      // 6. Przenieś zadania do sprintów
                      const moveToSprintData = RequestBuilder.buildMoveToSprintRequest();
                      const sprintsIds = 0; // Zwrotka z createSprint

                      // Jeżeli projekt z dzisiaj lub przyszły -> END

                      if (DateTime.fromJSDate(this.processData.projectStartDate).startOf('day') < DateTime.now().startOf('day')) {

                      }

                      // TO DO - obsługa projektu w przeszłości
                    }
                  });
              }
            });
        }
      });
  }

  private buildProcessData(mainFormData: MainFormControls) {
    this.processData = {
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
      },
      boardId: 0,
      sprintsIds: [],
      epicsIds: [],
      projectId: '',
      projectLink: '',
      issuesResponse: []
    };
  }
}
