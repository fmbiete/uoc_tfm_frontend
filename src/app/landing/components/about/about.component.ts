import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'landing-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  applicationTitle: string = environment.title;
}
