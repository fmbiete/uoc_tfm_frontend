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

      this.messageService.add({
        key: 'tc',
        sticky: true,
        severity: 'error',
        summary: $localize`Error`,
        detail: `${message}\n${error.error?.message} (Code: ${error.error?.reflection})`,
      });
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
