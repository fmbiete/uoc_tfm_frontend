import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/cart/services/cart.service';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';
import { PageDishes } from '../../models/dish.dto';
import { DishService } from '../../services/dish.service';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { RatingPipe } from '../../pipes/rating.pipe';
import { GridItemComponent } from '../grid-item/grid-item.component';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-browse',
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
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  category!: string;
  pageDishes$!: Observable<PageDishes>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dishService: DishService,
    private localStorage: LocalStorageService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.category = this.route.snapshot.queryParams['category'];

    // TODO: browse by category
    this.pageDishes$ = this.route.queryParams.pipe(
      // take the search term from the query string
      map((query) => query['category']),
      // switch to new search observable each time the term changes
      // switchMap((term: string) => this.dishService.browse(term)),
      switchMap((term: string) => this.dishService.favourites())
    );
  }
}
