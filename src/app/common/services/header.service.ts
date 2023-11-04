import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Header } from '../models/header.dto';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  header: Header;

  headerManagement: BehaviorSubject<Header>;

  constructor() {
    this.header = {
      showNoAuthSection: true,
      showAuthSection: false,
      showAdminSection: false,
      showSearch: false,
    };
    this.headerManagement = new BehaviorSubject<Header>(this.header);
  }

  showAuthenticated(admin: boolean | undefined): void {
    this.header.showNoAuthSection = false;
    this.header.showAuthSection = true;
    this.header.showAdminSection = admin ?? false;
    this.update();
  }

  showUnauthenticated(): void {
    this.header.showNoAuthSection = true;
    this.header.showAuthSection = false;
    this.header.showAdminSection = false;
    this.update();
  }

  hideSearch(): void {
    this.header.showSearch = false;
    this.update();
  }

  showSearch(): void {
    this.header.showSearch = true;
    this.update();
  }

  private update() {
    this.headerManagement.next(this.header);
  }
}
