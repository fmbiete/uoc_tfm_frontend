import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Header } from '../models/header.dto';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  headerManagement = new BehaviorSubject<Header>({
    showNoAuthSection: true,
    showAuthSection: false,
    showAdminSection: false,
  });

  showAuthenticated(admin: boolean | undefined): void {
    this.update(true, admin ?? false);
  }

  showUnauthenticated(): void {
    this.update(false, false);
  }

  private update(auhtenticated: boolean, admin: boolean) {
    const status: Header = {
      showNoAuthSection: !auhtenticated,
      showAuthSection: auhtenticated,
      showAdminSection: admin,
    };

    this.headerManagement.next(status);
  }
}
