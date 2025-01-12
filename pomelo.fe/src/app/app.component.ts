import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { JiraApiService } from './services/jira-api.service';
import { Issue } from './models/issue/issue.model';
import { issues, project, sprints } from './data/static-data';
import { Sprint } from './models/sprint/sprint.model';
import { Project } from './models/project/project.model';

@Component({
    selector: 'app-root',
    imports: [CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  private jiraApiService = inject(JiraApiService);
  projectData: Project = project;
  sprintsData: Sprint[] = sprints;
  issuesData: Issue[] = issues;

  showApiCalls = false;

  getSprintZero(): void {
    this.jiraApiService.getSprintZero()
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
    for (const sprint of this.sprintsData) {
      this.jiraApiService.createSprint(sprint)
        .subscribe(result => {
          console.log(result)
        });
    }
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
