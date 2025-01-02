import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { JiraApiService } from './services/jira-api.service';

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

  testApi() {
    this.jiraApiService.testApi()
      .subscribe((result: { data: object }) => {
        this.issue = result.data;
        console.log(result)
      });
  }

  getMetadata() {
    this.jiraApiService.getMetadata()
      .subscribe((result: { data: object }) => {
        this.meta = result.data;
        console.log(result)
      });
  }
}
