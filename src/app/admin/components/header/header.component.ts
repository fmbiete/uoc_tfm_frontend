import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { MenuComponent as UserMenuComponent } from 'src/app/users/components/menu/menu.component';

@Component({
  selector: 'admin-header',
  standalone: true,
  imports: [CommonModule, MenubarModule, UserMenuComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  applicationTitle: string = environment.title;
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: `Categories`,
        icon: 'pi pi-tags',
        styleClass: 'text-white',
        routerLink: ['/admin/categories'],
      },
      {
        label: 'Allergens',
        icon: 'pi pi-fw pi-exclamation-triangle',
        styleClass: 'text-white',
        routerLink: ['/admin/allergens'],
      },
      {
        label: 'Ingredients',
        icon: 'pi pi-list',
        styleClass: 'text-white',
        routerLink: ['/admin/ingredients'],
      },
      {
        label: `Dishes`,
        icon: 'pi pi-box',
        styleClass: 'text-white',
        routerLink: ['/admin/dishes'],
      },
      {
        label: `Promotions`,
        icon: 'pi pi-fw pi-gift',
        styleClass: 'text-white',
        items: [
          {
            label: `Active Promotions`,
            icon: 'pi pi-check',
            routerLink: ['/admin/promotions/true'],
          },
          {
            label: 'List Promotions',
            icon: 'pi pi-gift',
            routerLink: ['/admin/promotions/false'],
          },
        ],
      },
      {
        label: `Orders`,
        icon: 'pi pi-fw pi-shopping-cart',
        styleClass: 'text-white',
        items: [
          {
            label: `Today's Orders`,
            icon: 'pi pi-plus',
          },
          {
            label: `List Orders`,
            icon: 'pi pi-shopping-cart',
          },
        ],
      },
      {
        label: `Users`,
        icon: 'pi pi-user',
        styleClass: 'text-white',
        routerLink: ['/admin/users'],
      },
    ];
  }
}
