import { Component } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from 'src/app/dishes/components/search/search.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    CarouselComponent,
    ButtonModule,
    InputTextModule,
    SearchComponent,
  ],
})
export class HomeComponent {
  searchTerm!: string;

  searchDishes(): void {}
}
