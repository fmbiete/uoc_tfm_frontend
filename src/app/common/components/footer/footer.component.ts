import { Component } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
})
export class FooterComponent {
  applicationTitle: string = environment.title;
  companyName: string = environment.company;
  customIcons: Array<string> = ['facebook', 'linkedin', 'twitter'];

  constructor(
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.customIcons.forEach((icon) => {
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          `../../../assets/icons/${icon}.svg`
        )
      );
    });
  }

  about(): void {
    this.router.navigate(['about']);
  }
}
