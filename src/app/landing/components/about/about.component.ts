import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'landing-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true,
  imports: [CommonModule, CardModule],
})
export class AboutComponent {
  applicationTitle: string = environment.title;
}
