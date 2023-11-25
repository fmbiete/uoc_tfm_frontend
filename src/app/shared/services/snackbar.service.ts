import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private messageService: MessageService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  show(error: any, message: string): void {
    if (error !== null) {
      console.error(error);

      // Case error object with nested error
      if (error.error) {
        error = error.error;
      }

      // Case error object with message
      if (error.message) {
        const errorCode =
          error.reflection === undefined
            ? ''
            : $localize`Reflection Code: ${error.reflection}`;
        this.messageService.add({
          key: 'tc',
          life: 30000,
          severity: 'error',
          summary: $localize`Error`,
          detail: `${message}\n${error.message}\n${errorCode}`,
        });
      } else {
        // anything else
        this.messageService.add({
          key: 'tc',
          life: 30000,
          severity: 'error',
          summary: $localize`Error`,
          detail: `${message}\nFailed to connect to remote server`,
        });
      }
    } else {
      // No error
      this.messageService.add({
        key: 'tc',
        life: 5000,
        severity: 'success',
        summary: $localize`Success`,
        detail: message,
      });
    }
  }
}
