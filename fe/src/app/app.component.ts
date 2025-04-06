import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private translate = inject(TranslateService);
  currentYear = DateTime.now().year;
  currentLang!: string;
  switchToLang!: string;

  get isCurrentLangPl(): boolean {
    return this.currentLang.toLocaleLowerCase() === 'pl';
  }

  ngOnInit(): void {
    this.currentLang = localStorage.getItem('lang') || 'pl';
    this.translate.setDefaultLang(this.currentLang);
    this.translate.use(this.currentLang);
    this.setSwitchLangButtonText();
  }

  onLogoClick(): void {
    this.router.navigateByUrl('/');
  }

  onLanguageChange(): void {
    const newLang = this.currentLang === 'pl' ? 'en' : 'pl';
    this.translate.use(newLang);
    this.currentLang = newLang;
    localStorage.setItem('lang', newLang);
    this.setSwitchLangButtonText();
  }

  private setSwitchLangButtonText(): void {
    this.switchToLang = this.currentLang === 'pl' ? 'English' : 'Polski';
  }
}
