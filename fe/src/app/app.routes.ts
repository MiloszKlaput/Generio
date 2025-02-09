import { Routes } from '@angular/router';
import { MainFormComponent } from './components/main-form/main-form.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Form', component: MainFormComponent },
  { path: '**', redirectTo: '' }
];
