import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderService } from 'src/app/shared/services/header.service';
import { Header } from 'src/app/shared/models/header.dto';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuComponent as CartMenuComponent } from 'src/app/cart/components/menu/menu.component';
import { MenuComponent as UserMenuComponent } from 'src/app/users/components/menu/menu.component';
import { MenuCategoryComponent as DishesMenuCategoryComponent } from 'src/app/dishes/components/menu-category/menu-category.component';
import { MenuSearchComponent as DishesMenuSearchComponent } from 'src/app/dishes/components/menu-search/menu-search.component';

@Component({
  selector: 'landing-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ToolbarModule,
    CartMenuComponent,
    UserMenuComponent,
    DishesMenuCategoryComponent,
    DishesMenuSearchComponent,
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
}
