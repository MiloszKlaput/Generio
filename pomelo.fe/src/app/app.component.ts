import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { JiraApiService } from './services/jira-api.service';
import { IssuesRequest } from './models/issue/issue.model';
import { issues, project, sprint } from './data/static-data';
import { SprintRequest } from './models/sprint/sprint.model';
import { ProjectRequest } from './models/project/project.model';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  currentYear = new Date(Date.now()).getFullYear();
  private jiraApiService = inject(JiraApiService);
  projectData: ProjectRequest = project;
  sprintsData: SprintRequest = sprint;
  issuesData: IssuesRequest[] = issues;

  showApiCalls = false;

  getSprintZero(): void {
    this.jiraApiService.getBoardId()
      .subscribe(result => {
        console.log(result);
      });
  }

  createProject(): void {
    this.jiraApiService.createProject(this.projectData)
      .subscribe(result => {
        console.log(result);
      });
  }

  createSprint(): void {
    this.jiraApiService.createSprint(sprint)
      .subscribe(result => {
        console.log(result)
      });
  }

  createIssues(): void {
    this.jiraApiService.createIssues(this.issuesData)
      .subscribe(result => {
        console.log(result);
      });
  }

  testApi(): void {
    this.jiraApiService.testApi()
      .subscribe(result => {
        console.log(result)
      });
  }
}
