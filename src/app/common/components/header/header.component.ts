import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { Header } from '../../models/header.dto';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuComponent as CartMenuComponent } from 'src/app/cart/components/menu/menu.component';
import { MenuComponent as UserMenuComponent } from 'src/app/users/components/menu/menu.component';
import { MenuComponent as DishesMenuComponent } from 'src/app/dishes/components/menu/menu.component';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    ToolbarModule,
    ButtonModule,
    MenuModule,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    CartMenuComponent,
    UserMenuComponent,
    DishesMenuComponent,
  ],
})
export class HeaderComponent implements OnInit {
  applicationTitle: string = environment.title;

  // Flags controlling menu visibility
  showAdminSection: boolean;
  showAuthSection: boolean;
  showNoAuthSection: boolean;

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private localStorage: LocalStorageService
  ) {
    this.showAdminSection = false;
    this.showAuthSection = false;
    this.showNoAuthSection = true;
  }

  ngOnInit(): void {
    this.headerService.headerManagement.subscribe((status: Header) => {
      if (status) {
        this.showAuthSection = status.showAuthSection;
        this.showNoAuthSection = status.showNoAuthSection;
        this.showAdminSection = status.showAdminSection;
      }
    });
  }

  toggleSearch(): void {
    if (this.router.url.split('?')[0] != '/') {
      this.headerService.update(
        this.localStorage.isUserLogged(),
        this.localStorage.isUserAdmin(),
        true
      );
      this.router.navigate(['/']);
    } else {
      const searchBox = document.getElementById('searchBox');
      if (searchBox) {
        if (searchBox.classList.contains('hidden')) {
          searchBox.classList.remove('hidden');
        } else {
          searchBox.classList.add('hidden');
        }
      }
    }
  }
}
