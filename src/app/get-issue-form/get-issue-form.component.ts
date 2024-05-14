import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-get-issue-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './get-issue-form.component.html',
  styleUrl: './get-issue-form.component.scss'
})
export class GetIssueFormComponent {
  private http = inject(HttpClient);

  issue: any = null;

  // integracja z localhost a potem z host właściwym
  getIssue(getIssueForm: NgForm) {
    console.log(getIssueForm.form.value);
    const issueId = getIssueForm.form.value.issue;
    const url = `https://pomelopw.atlassian.net/rest/api/latest/issue/${issueId}`;
    this.http.get(url)
      .subscribe(result => this.issue = result);
  }
}
