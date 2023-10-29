import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { Header } from '../../models/header.dto';
import { NgIf } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuComponent as CartMenuComponent } from 'src/app/cart/components/menu/menu.component';
import { MenuComponent as UserMenuComponent } from 'src/app/users/components/menu/menu.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    ToolbarModule,
    ButtonModule,
    MenuModule,
    NgIf,
    RouterLink,
    RouterLinkActive,
    CartMenuComponent,
    UserMenuComponent,
  ],
})
export class HeaderComponent implements OnInit {
  applicationTitle: string = environment.title;

  // Flags controlling menu visibility
  showAdminSection: boolean;
  showAuthSection: boolean;
  showNoAuthSection: boolean;

  constructor(private headerService: HeaderService) {
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
