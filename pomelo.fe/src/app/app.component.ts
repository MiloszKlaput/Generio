import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GetIssueFormComponent } from './get-issue-form/get-issue-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GetIssueFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
