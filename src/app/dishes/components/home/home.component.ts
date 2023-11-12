import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { CarouselComponent } from '../carousel/carousel.component';
import { HeaderService } from 'src/app/shared/services/header.service';
import { Header } from 'src/app/shared/models/header.dto';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { first } from 'rxjs';

@Component({
  selector: 'dishes-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CarouselComponent,
    ButtonModule,
    InputTextModule,
    SearchComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  searchTerm!: string;
  showSearch: boolean;

  constructor(
    private headerService: HeaderService,
    private localStorage: LocalStorageService
  ) {
    this.showSearch = false;
  }

  ngOnInit(): void {
    // we only want to listen to the first change
    this.headerService.headerManagement.pipe(first()).subscribe({
      next: (value: Header) => {
        this.showSearch = value.showSearch;
        if (this.showSearch) this.headerService.hideSearch();
      },
    });
  }

  searchDishes(): void {
    // TODO:
  }
}
