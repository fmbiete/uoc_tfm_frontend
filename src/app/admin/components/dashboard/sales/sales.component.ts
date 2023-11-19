import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { FieldsetModule } from 'primeng/fieldset';
import { OrderService } from 'src/app/shared/services/order.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { first } from 'rxjs';
import { CountOrder } from 'src/app/shared/models/order.dto';

@Component({
  selector: 'admin-dashboard-sales',
  standalone: true,
  imports: [CommonModule, ChartModule, FieldsetModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  year: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any;

  constructor(
    private snackbar: SnackbarService,
    private orderService: OrderService
  ) {
    this.year = new Date().getFullYear();
  }

  ngOnInit() {
    this._setChartData(Array<number>(12).fill(0));
    this._setChartOptions();
    this._getChartData();
  }

  private _getChartData(): void {
    this.orderService
      .countYear$()
      .pipe(first())
      .subscribe({
        next: (value: CountOrder[]) => {
          const data = new Array<number>();
          for (let i = 1; i <= 12; i++) {
            const month = i < 10 ? `0${i}` : `${i}`;
            const count = value
              .filter((obj) => obj.day.slice(5, 7) == month)
              .reduce((accumulator, obj) => {
                return accumulator + obj.count;
              }, 0);
            data.push(count);
            // console.debug(`${month} => ${count}`);
          }
          this._setChartData(data);
        },
        error: (err) => {
          this.snackbar.show(
            err,
            $localize`Failed to count this year's Orders`
          );
        },
      });
  }

  private _setChartData(dataset: Array<number>): void {
    const documentStyle = getComputedStyle(document.documentElement);
    this.data = {
      labels: [
        $localize`January`,
        $localize`February`,
        $localize`March`,
        $localize`April`,
        $localize`May`,
        $localize`June`,
        $localize`July`,
        $localize`August`,
        $localize`September`,
        $localize`October`,
        $localize`November`,
        $localize`December`,
      ],
      datasets: [
        {
          label: $localize`Number of Orders`,
          data: dataset,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
        },
      ],
    };
  }

  private _setChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            precision: 0,
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }
}
