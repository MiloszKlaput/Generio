import { Routes } from '@angular/router';
import { JiraFormComponent } from './components/jira-form/jira-form.component';

export const routes: Routes = [
  { path: 'Form', component: JiraFormComponent },
  { path: '**', redirectTo: '' }
];
