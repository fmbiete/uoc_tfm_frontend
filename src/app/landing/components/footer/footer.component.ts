import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import {
  SelectButtonChangeEvent,
  SelectButtonModule,
} from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectButtonModule,
    TooltipModule,
    RouterLink,
  ],
})
export class FooterComponent {
  applicationTitle: string = environment.title;
  companyName: string = environment.company;
  language: string;
  currentLanguage: string;

  flags: any[] = [
    { language: $localize`English`, flag: 'en', value: 'en-GB' },
    { language: $localize`American English`, flag: 'us', value: 'en-US' },
    { language: $localize`Spanish`, flag: 'es', value: 'es-ES' },
  ];

  constructor(private router: Router, private domSanitizer: DomSanitizer) {
    this.currentLanguage = localStorage.getItem('language') ?? 'en-GB';
    this.language = this.currentLanguage;
  }

  about(): void {
    this.router.navigate(['about']);
  }

  languageChange(event: SelectButtonChangeEvent): void {
    console.debug(this.language);
    if (this.currentLanguage !== this.language) {
      localStorage.setItem('language', this.language);
      window.location.reload();
    }
  }
}
