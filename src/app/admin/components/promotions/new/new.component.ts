import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionService } from 'src/app/shared/services/promotion.service';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Dish } from 'src/app/shared/models/dish.dto';
import { Promotion } from 'src/app/shared/models/promotion.dto';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'admin-promotions-new',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    DividerModule,
    InputNumberModule,
    InputTextModule,
  ],
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
  providers: [DialogService],
})
export class NewComponent implements OnInit {
  createForm: UntypedFormGroup;
  periodDates: UntypedFormControl;
  cost: UntypedFormControl;
  dish: UntypedFormControl;

  private selectedDish: Dish;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private snackbar: SnackbarService,
    private promotionService: PromotionService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.selectedDish = config.data.dish;

    this.periodDates = new UntypedFormControl('', [Validators.required]);
    this.cost = new UntypedFormControl(0, [
      Validators.required,
      Validators.min(0),
    ]);
    this.dish = new UntypedFormControl(this.selectedDish.Name, [
      Validators.required,
    ]);

    this.createForm = this.formBuilder.group({
      periodDates: this.periodDates,
      cost: this.cost,
      dish: this.dish,
    });
  }

  ngOnInit(): void {
    return;
  }

  cancel(): void {
    this.ref.close(null);
  }

  create(): void {
    const promotion: Promotion = {
      ID: 0,
      DishID: this.selectedDish.ID,
      StartTime: this.periodDates.value[0],
      EndTime: this.periodDates.value[1],
      Cost: this.cost.value,
      Dish: new Dish(),
    };

    this.promotionService.create$(promotion).subscribe({
      next: (value: Promotion) => {
        this.snackbar.show(null, $localize`Dish Promotion Creation succeded`);
        this.ref.close(value);
      },
      error: (err) => {
        this.snackbar.show(err, $localize`Dish Promotion Creation failed`);
        this.ref.close(null);
      },
    });
  }
}
