import { inject, Injectable } from '@angular/core';
import { JiraApiService } from './jira-api.service';
import { RequestBuilder } from '../logic/request-builder.logic';
import { ProjectRequest, ProjectResponse } from '../models/project/project.model';
import { SprintRequest, SprintResponse } from '../models/sprint/sprint.model';
import { IssuesRequest, IssuesResponse } from '../models/issue/issue.model';
import { MoveToEpicRequest } from '../models/issue/move-to-epic.model';
import { MoveToSprintRequest } from '../models/issue/move-to-sprint.model';
import { MainFormControls } from '../types/main-form-controls.type';
import { IsProjectNeeded } from '../enums/is-project-needed.enum';
import { RequestData, ResponseData } from '../models/process/process-data.model';
import { DateTime } from 'luxon';
import {
  from,
  switchMap,
  concatMap,
  toArray,
  tap,
  Observable,
  catchError,
  throwError
} from 'rxjs';
import { BoardIdResponse } from '../models/board/board.model';


@Injectable({
  providedIn: 'root'
})
export class JiraPopulateProcessService {
  private apiService = inject(JiraApiService);
  private requestData!: RequestData;
  private responseData!: ResponseData;

  startProcess(mainFormData: MainFormControls): void {
    this.initRequestData(mainFormData);
    this.initResponseData();

    if (this.requestData.isProjectNeeded === IsProjectNeeded.Yes) {
      this.createNewProject(mainFormData).subscribe({
        next: () => this.continueProcess(mainFormData),
        error: (err) => console.error(err)
      });
    } else {
      this.continueProcess(mainFormData);
    }
  }

  private continueProcess(data: MainFormControls): void {
    const projectKey = this.resolveProjectKey();

    this.getBoardId(projectKey)
      .pipe(
        switchMap(() => this.createSprints(data)),
        switchMap(() => this.createEpics(data)),
        switchMap(() => this.createIssues(data)),
        switchMap(() => this.linkIssuesToEpics()),
        switchMap(() => this.linkIssuesToSprints())
      )
      .subscribe({
        next: () => this.handlePastProjectScenario(),
        error: (err) => console.error(err)
      });
  }

  private createNewProject(data: MainFormControls): Observable<ProjectResponse> {
    const request: ProjectRequest = RequestBuilder.buildProjectRequest(data);

    return this.apiService.createProject(request).pipe(
      tap((res: ProjectResponse) => {
        this.responseData.projectId = res.data.id;
        this.responseData.projectLink = res.data.self;
        this.responseData.projectKey = res.data.key;
      }),
      catchError((err) => {
        console.error('Error creating project', err);
        return throwError(() => err);
      })
    );
  }

  private getBoardId(projectKey: string): Observable<BoardIdResponse> {
    return this.apiService.getBoardId(projectKey).pipe(
      tap((res: BoardIdResponse) => {
        this.responseData.boardId = res.data;
      }),
      catchError((err) => {
        console.error('Error resolving board', err);
        return throwError(() => err);
      })
    );
  }

  private createSprints(data: MainFormControls): Observable<SprintResponse[]> {
    const sprints: SprintRequest[] = RequestBuilder.buildSprintsRequest(
      data,
      this.responseData.boardId
    );
    return from(sprints).pipe(
      concatMap((sprint: SprintRequest) => this.apiService.createSprint(sprint)),
      toArray(),
      tap((res: SprintResponse[]) => {
        this.responseData.sprints = res;
      }),
      catchError((err) => {
        console.error('Error creating sprints', err);
        return throwError(() => err);
      })
    );
  }

  private createEpics(data: MainFormControls): Observable<IssuesResponse> {
    const projectKey = this.resolveProjectKey();
    const epics: IssuesRequest[] = RequestBuilder.buildEpicsRequest(data, projectKey);
    return this.apiService.createIssues(epics).pipe(
      tap((res: IssuesResponse) => {
        res.data.issues.forEach((epic) => {
          this.responseData.epicsIds.push(epic.id);
        });
      }),
      catchError((err) => {
        console.error('Error creating epics', err);
        return throwError(() => err);
      })
    );
  }

  private createIssues(data: MainFormControls): Observable<IssuesResponse> {
    const projectKey = this.resolveProjectKey();
    const issues: IssuesRequest[] = RequestBuilder.buildIssuesRequest(data, projectKey);
    return this.apiService.createIssues(issues).pipe(
      tap((res: IssuesResponse) => {
        this.responseData.issues = res.data.issues;
      }),
      catchError((err) => {
        console.error('Error creating issues', err);
        return throwError(() => err);
      })
    );
  }

  private linkIssuesToEpics(): Observable<unknown[]> {
    const requests: MoveToEpicRequest[] = RequestBuilder.buildMoveToEpicRequest(
      this.responseData.epicsIds,
      this.responseData.issues
    );
    return from(requests).pipe(
      concatMap((req: MoveToEpicRequest) => this.apiService.moveIssuesToEpic(req)),
      toArray(),
      catchError((err) => {
        console.error('Error linking issues to epics', err);
        return throwError(() => err);
      })
    );
  }

  private linkIssuesToSprints(): Observable<unknown[]> {
    const sprintsIds = this.responseData.sprints.map((s) => s.data.id);
    const requests: MoveToSprintRequest[] =
      RequestBuilder.buildMoveToSprintRequest(sprintsIds, this.responseData.issues);
    this.responseData.sprintIssuesAssigment = requests;
    return from(requests).pipe(
      concatMap((req: MoveToSprintRequest) => this.apiService.moveIssuesToSprint(req)),
      toArray(),
      catchError((err) => {
        console.error('Error linking issues to sprints', err);
        return throwError(() => err);
      })
    );
  }

  private handlePastProjectScenario(): void {
    const startDate = DateTime.fromJSDate(this.requestData.projectStartDate).startOf('day');
    const now = DateTime.now().startOf('day');

    if (startDate < now) {

      const issuesWithPastDates = this.responseData.issues.map((issue, index) => {
        const resolvedDate = startDate.plus({ days: index + 1 });
        const finalResolvedDate = resolvedDate > now ? now : resolvedDate;

        return {
          key: issue.key,
          createdDate: startDate.toISO(),
          resolvedDate: finalResolvedDate.toISO()
        };
      });

      const jsonDoc = JSON.stringify(issuesWithPastDates, null, 2);
      console.log('Issues with past dates:\n', jsonDoc);

      // W tym miejscu możesz np. zapisać plik .json przez inny serwis,
      // wysłać do back-endu, itp.
    }
  }


  private resolveProjectKey(): string {
    return this.responseData?.projectKey
      ? this.responseData.projectKey
      : this.requestData.existingProjectKey;
  }

  private initRequestData(formData: MainFormControls): void {
    this.requestData = {
      isProjectNeeded: formData.isProjectNeeded.value!,
      existingProjectKey: formData.existingProjectKey.value!,
      projectName: formData.projectName.value!,
      projectDescription: formData.projectDescription.value!,
      projectKey: formData.projectKey.value!,
      atlassianId: formData.atlassianId.value!,
      sprintsCount: formData.sprintsCount.value!,
      sprintDuration: formData.sprintDuration.value!,
      projectStartDate: formData.projectStartDate.value!,
      epicsCount: formData.epicsCount.value!,
      issuesCount: formData.issuesCount.value!,
      issuesTypes: {
        story: formData.issuesTypes.value.story!,
        bug: formData.issuesTypes.value.bug!,
        task: formData.issuesTypes.value.task!
      }
    };
  }

  private initResponseData(): void {
    this.responseData = {
      projectId: '',
      projectLink: '',
      projectKey: '',
      boardId: 0,
      sprints: [],
      epicsIds: [],
      issues: [],
      sprintIssuesAssigment: []
    };
  }
}
