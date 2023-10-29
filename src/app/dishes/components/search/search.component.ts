import { Component, Input, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from 'src/app/cart/services/cart.service';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';
import { PageDishes } from '../../models/dish.dto';
import { DishService } from '../../services/dish.service';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { RatingComponent } from '../rating/rating.component';
import { RatingPipe } from '../../pipes/rating.pipe';
import { GridItemComponent } from '../grid-item/grid-item.component';

@Component({
  selector: 'dishes-search',
  standalone: true,
  imports: [
    AsyncPipe,
    RatingPipe,
    CommonModule,
    ButtonModule,
    DataViewModule,
    MessageModule,
    TagModule,
    RatingComponent,
    GridItemComponent,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input('searchTerm') searchTerm!: string;

  pageDishes$: Observable<PageDishes>;

  constructor(
    private router: Router,
    private dishService: DishService,
    private localStorage: LocalStorageService,
    private cartService: CartService
  ) {
    // TODO: search dishes
    this.pageDishes$ = this.dishService.favourites();
  }
  ngOnInit(): void {
    // TODO: listen to searchTerm changes and search again
    return;
  }
}
