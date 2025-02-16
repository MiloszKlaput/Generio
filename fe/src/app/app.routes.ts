import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProcessMainComponent } from './components/process/process-main.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Form', component: ProcessMainComponent },
  { path: '**', redirectTo: '' }
];
