import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Allergen } from 'src/app/dishes/models/allergen.dto';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table, TableModule } from 'primeng/table';
import { first } from 'rxjs';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { NewComponent } from '../new/new.component';
import { AllergenService } from 'src/app/admin/services/allergen.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ConfirmationService, DialogService],
})
export class ListComponent {
  @ViewChild('table') table!: Table;

  allergens: Allergen[];
  loading: boolean;
  // Backup for edits
  private clonedAllergens: { [s: string]: Allergen } = {};
  private dialogRef: DynamicDialogRef | undefined;

  constructor(
    private snackbar: SnackbarService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private allergenService: AllergenService
  ) {
    this.allergens = new Array<Allergen>();
    this.loading = true;
  }

  ngOnInit(): void {
    this._subscribeAllergens();
  }

  ngOnDestroy(): void {
    if (this.dialogRef) this.dialogRef.close();
  }

  // Filters
  applyFilterGlobal(table: Table, $event: any, stringVal: any) {
    table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  resetFilter(table: Table) {
    table.clear();
  }

  onRowDelete(allergen: Allergen) {
    this.confirmationService.confirm({
      message: $localize`Do you want to delete this Allergen?\n${allergen.Name}`,
      header: $localize`Delete Confirmation`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._deleteAllergen(allergen);
      },
    });
  }

  onRowEditCancel(allergen: Allergen, index: number) {
    // restore original row
    this.allergens[index] = this.clonedAllergens[allergen.ID.toString()];
    delete this.clonedAllergens[allergen.ID.toString()];
  }

  // Edit
  onRowEditInit(allergen: Allergen) {
    // save original row
    this.clonedAllergens[allergen.ID.toString()] = { ...allergen };
  }

  onRowEditSave(allergen: Allergen) {
    this.allergenService.modify$(allergen).subscribe({
      next: (value: Allergen) => {
        // row is already updated in memory
        // delete backup
        delete this.clonedAllergens[allergen.ID.toString()];
      },
      error: (err: any) => {
        this.snackbar.show(err, $localize`Failed to modify Allergen`);
        // find original id
        const index = this.allergens.findIndex((v) => v.ID == allergen.ID);
        // restore original row
        this.allergens[index] = this.clonedAllergens[allergen.ID.toString()];
        delete this.clonedAllergens[allergen.ID.toString()];
      },
    });
  }

  openCreate(): void {
    this.dialogRef = this.dialogService.open(NewComponent, {
      header: $localize`Create Allergen`,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    this.dialogRef.onClose.subscribe((result: Allergen | undefined) => {
      if (result) this._addAllergen(result);
    });
  }

  private _addAllergen(value: Allergen) {
    const found = this.allergens.find((c) => c.ID == value.ID);
    if (!found) {
      this.allergens.push(value);
      this.allergens.sort((a, b) => {
        if (a.Name < b.Name) {
          return -1;
        }
        if (a.Name > b.Name) {
          return 1;
        }
        return 0;
      });
      this.table.reset();
    }
  }

  private _deleteAllergen(allergen: Allergen): void {
    this.allergenService
      .delete$(allergen.ID)
      .pipe(first())
      .subscribe({
        next: () => {
          this.snackbar.show(null, $localize`Allergen was deleted`);
          this.allergens = this.allergens.filter(
            (c: Allergen) => c.ID !== allergen.ID
          );
          this.table.reset();
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`Failed to delete Allergen`);
        },
      });
  }

  private _subscribeAllergens(): void {
    this.allergenService
      .list$()
      .pipe(first())
      .subscribe({
        next: (value: Allergen[]) => {
          this.allergens = value;
          this.loading = false;
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`Failed to list Allergens`);
        },
      });
  }
}
