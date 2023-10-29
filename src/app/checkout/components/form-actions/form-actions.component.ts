import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';

@Component({
  selector: 'checkout-form-actions',
  templateUrl: './form-actions.component.html',
  styleUrls: ['./form-actions.component.scss'],
  standalone: true,
  imports: [ButtonModule, DividerModule],
})
export class FormActionsComponent {
  @Input('primary-label') primaryLabel!: string;
  @Input('primary-function') primaryFunction!: any;
  @Input('primary-disabled') primaryDisabled!: boolean;
  @Input('secondary-label') secondaryLabel!: string;
  @Input('secondary-function') secondaryFunction!: any;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService
  ) {}
}
