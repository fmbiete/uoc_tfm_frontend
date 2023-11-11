import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private messageService: MessageService) {}

  show(error: any, message: string): void {
    if (error !== null) {
      console.error(error);

      // Case error object with nested error
      if (error.error) {
        error = error.error;
      }

      // Case error object with message
      if (error.message) {
        this.messageService.add({
          key: 'tc',
          sticky: true,
          severity: 'error',
          summary: $localize`Error`,
          detail: `${message}\n${error.message}\nReflection Code: ${error.reflection}`,
        });
      } else {
        // anything else
        this.messageService.add({
          key: 'tc',
          sticky: true,
          severity: 'error',
          summary: $localize`Error`,
          detail: `${message}\nFailed to connect to remote server (Code: -1)`,
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
