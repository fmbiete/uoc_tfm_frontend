import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { MenuComponent as UserMenuComponent } from 'src/app/users/components/menu/menu.component';

@Component({
  selector: 'admin-menubar',
  standalone: true,
  imports: [CommonModule, MenubarModule, UserMenuComponent],
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss'],
})
export class MenubarComponent implements OnInit {
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
        icon: 'pi pi-fw pi-box',
        styleClass: 'text-white',
        items: [
          {
            label: 'New Dish',
            icon: 'pi pi-plus',
          },
          {
            label: 'List Dishes',
            icon: 'pi pi-box',
          },
        ],
      },
      {
        label: `Promotions`,
        icon: 'pi pi-fw pi-gift',
        styleClass: 'text-white',
        items: [
          {
            label: `Active Promotions`,
            icon: 'pi pi-check',
          },
          {
            label: 'New Promotion',
            icon: 'pi pi-plus',
          },
          {
            label: 'List Promotions',
            icon: 'pi pi-gift',
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
