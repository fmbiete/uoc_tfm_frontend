import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationService } from 'src/app/shared/services/configuration.service';
import { first, timer } from 'rxjs';
import { Configuration } from 'src/app/shared/models/configuration.dto';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DividerModule,
    InputMaskModule,
    InputNumberModule,
    MessageModule,
  ],
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit {
  loading: boolean;
  configuration: Configuration;
  createForm: UntypedFormGroup;
  deliveryTime: UntypedFormControl;
  changesTime: UntypedFormControl;
  subvention: UntypedFormControl;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private snackbarService: SnackbarService,
    private configurationService: ConfigurationService
  ) {
    this.loading = false;
    this.configuration = new Configuration();

    this.subvention = new UntypedFormControl(0, [
      Validators.required,
      Validators.min(0),
    ]);
    const timeRegex = `([0-1][0-9]|2[0-3]):([0-5][0-9])`;
    this.deliveryTime = new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(timeRegex),
    ]);
    this.changesTime = new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(timeRegex),
    ]);

    this.createForm = this.formBuilder.group({
      subvention: this.subvention,
      deliveryTime: this.deliveryTime,
      changesTime: this.changesTime,
    });
  }

  ngOnInit(): void {
    this._loadConfiguration();
  }

  cancel(): void {
    this._loadConfiguration();
  }

  update(): void {
    const changeTime = new Date();
    changeTime.setHours(this.changesTime.value.substring(0, 2));
    changeTime.setMinutes(this.changesTime.value.substring(3, 5));
    changeTime.setSeconds(0);
    this.configuration.ChangesTime = changeTime;
    const deliveryTime = new Date();
    deliveryTime.setHours(this.deliveryTime.value.substring(0, 2));
    deliveryTime.setMinutes(this.deliveryTime.value.substring(3, 5));
    deliveryTime.setSeconds(0);
    this.configuration.DeliveryTime = deliveryTime;
    this.configuration.Subvention = this.subvention.value;
    this.loading = true;
    this.configurationService
      .update$(this.configuration)
      .pipe(first())
      .subscribe({
        next: (value: Configuration) => {
          this._setConfiguration(value);
          this.snackbarService.show(
            null,
            $localize`Configuration has been modified`
          );
        },
        error: (err) => {
          this.snackbarService.show(
            err,
            $localize`Failed to modify configuration`
          );
        },
      });
  }

  private _loadConfiguration(): void {
    this.loading = true;
    this.configurationService
      .get$()
      .pipe(first())
      .subscribe({
        next: (value: Configuration) => {
          this._setConfiguration(value);
        },
        error: (err) => {
          this.snackbarService.show(
            err,
            $localize`Failed to get configuration`
          );
        },
      });
  }

  private _setConfiguration(configuration: Configuration): void {
    this.configuration = configuration;
    console.debug(configuration);
    this.changesTime.setValue(
      new Date(configuration.ChangesTime).toTimeString().substring(0, 5)
    );
    this.deliveryTime.setValue(
      new Date(configuration.DeliveryTime).toTimeString().substring(0, 5)
    );
    this.subvention.setValue(configuration.Subvention);
    this.loading = false;
  }
}
