import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { PromotionService } from 'src/app/shared/services/promotion.service';
import { first } from 'rxjs';
import { CountPromotions } from 'src/app/shared/models/promotion.dto';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'admin-dashboard-promotions',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TooltipModule],
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss'],
})
export class PromotionsComponent implements OnInit {
  numPromotions: number;

  constructor(
    private snackbar: SnackbarService,
    private promotionService: PromotionService
  ) {
    this.numPromotions = 0;
  }

  ngOnInit(): void {
    this.promotionService
      .count$(true /*activeOnly*/)
      .pipe(first())
      .subscribe({
        next: (value: CountPromotions) => {
          this.numPromotions = value.count;
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to count active promotions`);
        },
      });
  }
}
