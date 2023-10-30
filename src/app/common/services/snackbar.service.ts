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

      if (error.message) {
        this.messageService.add({
          key: 'tc',
          sticky: true,
          severity: 'error',
          summary: $localize`Error`,
          detail: `${message}\n${error.message} (Code: ${error.reflection})`,
        });
      } else {
        this.messageService.add({
          key: 'tc',
          sticky: true,
          severity: 'error',
          summary: $localize`Error`,
          detail: `${message}\nFailed to connect to remote server (Code: -1)`,
        });
      }
    } else {
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
