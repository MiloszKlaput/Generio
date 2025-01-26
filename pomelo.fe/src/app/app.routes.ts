import { Routes } from '@angular/router';
import { MainFormComponent } from './components/main-form/main-form.component';

export const routes: Routes = [
  { path: 'Form', component: MainFormComponent },
  { path: '**', redirectTo: '' }
];
