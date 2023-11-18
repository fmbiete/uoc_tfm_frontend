import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { PagePromotions, Promotion } from 'src/app/shared/models/promotion.dto';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule, Table, TableLazyLoadEvent } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription, first } from 'rxjs';
import { PromotionService } from 'src/app/shared/services/promotion.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { NewComponent } from '../new/new.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'admin-promotions-list',
  standalone: true,
  imports: [
    CommonModule,
    TitleCasePipe,
    FormsModule,
    ButtonModule,
    CalendarModule,
    ConfirmDialogModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ConfirmationService, DialogService],
})
export class ListComponent implements OnDestroy, OnInit {
  @Input() activeOnly: boolean;
  @ViewChild('table') table!: Table;

  pageTitle: string;
  promotions: Promotion[];
  loading: boolean;
  // Backup for edits
  private clonedPromotions: { [s: string]: Promotion } = {};
  private dialogRef: DynamicDialogRef | undefined;

  fakeTotalPromotions: number;
  private routeSubscription!: Subscription;

  startTime: Date;
  endTime: Date;

  constructor(
    private route: ActivatedRoute,
    private snackbar: SnackbarService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private promotionService: PromotionService
  ) {
    this.activeOnly = this.route.snapshot.paramMap.get('activeOnly') === 'true';
    this.pageTitle = '';
    this.startTime = this.endTime = new Date();
    this.promotions = new Array<Promotion>();
    this.loading = true;
    // mark the total as 1+row size to have pagination
    this.fakeTotalPromotions = 10 + 1;
  }

  ngOnInit(): void {
    // lazy load
    this.loading = true;
    // Same page multiple links and parameters
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      this.activeOnly = params.get('activeOnly') === 'true';
      this.pageTitle = this.activeOnly
        ? $localize`Active Promotions`
        : $localize`Promotions`;
      const event: TableLazyLoadEvent = {};
      this.loadPromotions(event);
    });
  }

  ngOnDestroy(): void {
    if (this.dialogRef) this.dialogRef.close();
    this.routeSubscription.unsubscribe();
  }

  applyFilterGlobal(table: Table, $event: Event, stringVal: string) {
    table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  resetFilter(table: Table) {
    table.clear();
  }

  loadPromotions(event: TableLazyLoadEvent): void {
    // pageSize is the value selected or 10
    const pageSize = event.rows ?? 10;
    // pageCount is 0 based in the table, but 1 based in the API
    // first contains the number of elements
    const pageCount = event.first == undefined ? 1 : event.first / pageSize + 1;
    this._subscribePromotions(pageSize, pageCount);
  }

  onRowDelete(promotion: Promotion) {
    this.confirmationService.confirm({
      message: $localize`Do you want to delete this Promotion?\n${promotion.Dish?.Name}`,
      header: $localize`Delete Confirmation`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._deletePromotion(promotion);
      },
    });
  }

  onRowEditCancel(promotion: Promotion, index: number) {
    // restore original row
    this.promotions[index] = this.clonedPromotions[promotion.ID.toString()];
    delete this.clonedPromotions[promotion.ID.toString()];
  }

  // Edit
  onRowEditInit(promotion: Promotion) {
    // save original row
    this.clonedPromotions[promotion.ID.toString()] = { ...promotion };
    this.startTime = new Date(promotion.StartTime);
    this.endTime = new Date(promotion.EndTime);
  }

  onRowEditSave(promotion: Promotion) {
    promotion.StartTime = this.startTime;
    promotion.EndTime = this.endTime;
    this.promotionService.modify$(promotion).subscribe({
      next: (value: Promotion) => {
        // row is already updated in memory
        // delete backup
        delete this.clonedPromotions[value.ID.toString()];
      },
      error: (err) => {
        this.snackbar.show(err, $localize`Failed to modify category`);
        // find original id
        const index = this.promotions.findIndex((v) => v.ID == promotion.ID);
        // restore original row
        this.promotions[index] = this.clonedPromotions[promotion.ID.toString()];
        delete this.clonedPromotions[promotion.ID.toString()];
      },
    });
  }

  openCreate(): void {
    this.dialogRef = this.dialogService.open(NewComponent, {
      header: $localize`Create Promotion`,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    this.dialogRef.onClose.subscribe((result: Promotion | undefined) => {
      if (result) this._addPromotion(result);
    });
  }

  private _addPromotion(value: Promotion) {
    const found = this.promotions.find((c) => c.ID == value.ID);
    if (!found) {
      this.promotions.push(value);
      this.promotions.sort((a, b) => {
        if (a.StartTime < b.StartTime) {
          return -1;
        }
        if (a.StartTime > b.StartTime) {
          return 1;
        }
        return 0;
      });
      this.table.reset();
    }
  }

  private _deletePromotion(promotion: Promotion): void {
    this.promotionService
      .delete$(promotion.ID)
      .pipe(first())
      .subscribe({
        next: () => {
          this.snackbar.show(null, $localize`Promotion was deleted`);
          this.promotions = this.promotions.filter(
            (c: Promotion) => c.ID !== promotion.ID
          );
          this.table.reset();
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to delete Promotion`);
        },
      });
  }

  private _subscribePromotions(pageSize: number, pageCount: number): void {
    this.promotionService
      .list$(this.activeOnly, pageSize, pageCount)
      .pipe(first())
      .subscribe({
        next: (value: PagePromotions) => {
          this.promotions = value.promotions;
          if (value.promotions.length == pageSize) {
            // If this page is full of elements (we exactly have pageSize),
            // we add 1 to our fake total to enable "next page"
            this.fakeTotalPromotions = pageSize * pageCount + 1;
          } else {
            // If this page is not full
            // we add only what we have; this will disable "next page"
            this.fakeTotalPromotions =
              pageSize * (pageCount - 1) + value.promotions.length;
          }
          this.loading = false;
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to list promotions`);
        },
      });
  }
}
