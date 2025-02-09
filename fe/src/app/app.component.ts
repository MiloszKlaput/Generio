import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private router = inject(Router);
  currentYear = new Date(Date.now()).getFullYear();

  onLogoClick(): void {
    this.router.navigate(['/']);
  }
}
