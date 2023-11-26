import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-steps',
  standalone: true,
  imports: [CommonModule, StepsModule],
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
})
export class StepsComponent implements OnInit {
  steps: Array<MenuItem>;

  constructor() {
    this.steps = new Array<MenuItem>();
  }

  ngOnInit(): void {
    this.steps = [
      {
        label: $localize`Address`,
        routerLink: 'address',
      },
      {
        label: $localize`Payment`,
        routerLink: 'payment',
      },
      {
        label: $localize`Confirmation`,
        routerLink: 'success',
      },
    ];
  }
}
