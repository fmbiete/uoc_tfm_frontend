import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router, RouterLink } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import {
  SelectButtonChangeEvent,
  SelectButtonModule,
} from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'landing-footer',
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
  applicationTitle: string;
  companyName: string;
  language: string;
  currentLanguage: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  flags: Array<any>;

  constructor(private router: Router) {
    this.applicationTitle = environment.title;
    this.companyName = environment.company;
    this.currentLanguage = localStorage.getItem('language') ?? 'en-GB';
    this.language = this.currentLanguage;

    this.flags = [
      { language: $localize`English`, flag: 'en', value: 'en-GB' },
      { language: $localize`American English`, flag: 'us', value: 'en-US' },
      { language: $localize`Spanish`, flag: 'es', value: 'es-ES' },
    ];
  }

  about(): void {
    this.router.navigate(['about']);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  languageChange(event: SelectButtonChangeEvent): void {
    if (this.currentLanguage !== this.language) {
      localStorage.setItem('language', this.language);
      window.location.reload();
    }
  }
}
