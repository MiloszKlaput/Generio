import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  getIssue(getIssueForm: NgForm) {

    // const name = getIssueForm.form.value.name;
    // const issueId = getIssueForm.form.value.issue;

    const url = `http://localhost:8080/api`;
    this.http.get(url)
      .subscribe(result => console.log(result));
  }
}
