import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { Category } from '../../models/category.dto';

@Component({
  selector: 'dishes-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenuModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  categories: MenuItem[];

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService
  ) {
    this.categories = new Array<MenuItem>();
  }

  ngOnInit(): void {
    this.categoryService.listCategories$().subscribe({
      next: (value: Category[]) => {
        value.forEach((v: Category) => {
          this.categories.push({
            label: v.Name,
            command: () => {
              this.browseDishes(v.ID, v.Name);
            },
          });
        });
      },
      error: (err: any) => {
        this.snackbarService.show(
          err,
          $localize`Failed to list dish categories`
        );
      },
    });
  }

  browseDishes(id: number, name: string) {
    this.router.navigate(['dishes', 'browse'], {
      queryParams: { categoryId: id, categoryName: name },
    });
  }
}
