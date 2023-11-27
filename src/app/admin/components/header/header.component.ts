import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { MenuComponent as UserMenuComponent } from 'src/app/users/components/menu/menu.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'admin-header',
  standalone: true,
  imports: [CommonModule, MenubarModule, TooltipModule, UserMenuComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  applicationTitle: string = environment.title;
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: $localize`Categories`,
        icon: 'pi pi-tags',
        styleClass: 'text-white',
        routerLink: ['/admin/categories'],
      },
      {
        label: $localize`Allergens`,
        icon: 'pi pi-fw pi-exclamation-triangle',
        styleClass: 'text-white',
        routerLink: ['/admin/allergens'],
      },
      {
        label: $localize`Ingredients`,
        icon: 'pi pi-list',
        styleClass: 'text-white',
        routerLink: ['/admin/ingredients'],
      },
      {
        label: $localize`Dishes`,
        icon: 'pi pi-box',
        styleClass: 'text-white',
        routerLink: ['/admin/dishes'],
      },
      {
        label: $localize`Promotions`,
        icon: 'pi pi-fw pi-gift',
        styleClass: 'text-white',
        items: [
          {
            label: $localize`Active Promotions`,
            icon: 'pi pi-check',
            routerLink: ['/admin/promotions/true'],
          },
          {
            label: $localize`List Promotions`,
            icon: 'pi pi-gift',
            routerLink: ['/admin/promotions/false'],
          },
        ],
      },
      {
        label: $localize`Orders`,
        icon: 'pi pi-fw pi-shopping-cart',
        styleClass: 'text-white',
        items: [
          {
            label: $localize`Today's Orders`,
            icon: 'pi pi-shopping-cart',
            routerLink: ['/admin/orders/true'],
          },
          {
            label: $localize`List Orders`,
            icon: 'pi pi-shopping-cart',
            routerLink: ['/admin/orders/false'],
          },
        ],
      },
      {
        label: $localize`Users`,
        icon: 'pi pi-user',
        styleClass: 'text-white',
        routerLink: ['/admin/users'],
      },
      {
        label: $localize`Configuration`,
        icon: 'pi pi-wrench',
        styleClass: 'text-white',
        routerLink: ['/admin/configuration'],
      },
    ];
  }
}
