import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { JiraApiService } from './services/jira-api.service';
import { IssueType } from './models/issue/enums/issue-type.enum';
import { Issue } from './models/issue/issue.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private jiraApiService = inject(JiraApiService);
  issue: any;
  meta: any;
  issuesPackage: Issue[] = [
    {
      fields: {
        project: { key: "KIWI" },
        summary: "Story założone przez API",
        description: "Przykładowe zadanie założone przez API",
        issuetype: { id: IssueType.Story }
      }
    },
    {
      fields: {
        project: { key: "KIWI" },
        summary: "Bug założony przez API2",
        description: "Przykładowe zadanie założone przez API2",
        issuetype: { id: IssueType.Bug }
      }
    }
  ];

  sendIssues(): void {
    this.jiraApiService.sendIssues(this.issuesPackage)
      .subscribe(result => {
        console.log(result);
      })
  }

  testApi() {
    this.jiraApiService.testApi()
      .subscribe((result: { data: object }) => {
        this.issue = result.data;
        console.log(result)
      });
  }

  // getMetadata() {
  //   this.jiraApiService.getMetadata()
  //     .subscribe((result: { data: object }) => {
  //       this.meta = result.data;
  //       console.log(result)
  //     });
  // }
}
