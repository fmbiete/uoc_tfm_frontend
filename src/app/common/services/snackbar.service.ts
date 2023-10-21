import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  show(error: any, message: string): void {
    if (error !== null) {
      console.error(error);
      this.snackBar.open(
        `${message}\n${error.error?.message} (Code: ${error.error?.reflection})`,
        $localize`Dismiss`,
        {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        }
      );
    } else {
      this.snackBar.open(message, $localize`Dismiss`, {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar'],
      });
    }
  }
}
