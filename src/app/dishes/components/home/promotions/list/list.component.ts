import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionService } from 'src/app/shared/services/promotion.service';
import { first } from 'rxjs';
import { Dish } from 'src/app/shared/models/dish.dto';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ItemComponent } from '../../item/item.component';
import { PagePromotions } from 'src/app/shared/models/promotion.dto';

@Component({
  selector: 'dishes-home-promotions-list',
  standalone: true,
  imports: [CommonModule, ItemComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  loading: boolean;
  dishes: Array<Dish>;

  constructor(
    private snackbar: SnackbarService,
    private promotionService: PromotionService
  ) {
    this.loading = true;
    this.dishes = new Array<Dish>();
  }

  ngOnInit(): void {
    this.promotionService
      .list$(true /*activeOnly*/, 10, 1)
      .pipe(first())
      .subscribe({
        next: (value: PagePromotions) => {
          this.dishes = value.promotions.map((p) => {
            // promoted price
            p.Dish.Cost = p.Cost;
            return p.Dish;
          });
          this.loading = false;
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to list favourites`);
        },
      });
  }
}
