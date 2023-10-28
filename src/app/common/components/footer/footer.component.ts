import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [ButtonModule, TooltipModule, RouterLink],
})
export class FooterComponent {
  applicationTitle: string = environment.title;
  companyName: string = environment.company;

  constructor(private router: Router, private domSanitizer: DomSanitizer) {}

  about(): void {
    this.router.navigate(['about']);
  }
}
