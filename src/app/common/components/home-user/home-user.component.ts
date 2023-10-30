import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from 'src/app/dishes/components/search/search.component';
import { CarouselComponent } from '../carousel/carousel.component';

@Component({
  selector: 'common-home-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CarouselComponent,
    ButtonModule,
    InputTextModule,
    SearchComponent,
  ],
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.scss'],
})
export class HomeUserComponent {
  searchTerm!: string;

  searchDishes(): void {}
}
