import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/shared/services/category.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Category } from 'src/app/shared/models/category.dto';
import { first } from 'rxjs';

@Component({
  selector: 'dishes-menu-category',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenuModule],
  templateUrl: './menu-category.component.html',
  styleUrls: ['./menu-category.component.scss'],
})
export class MenuCategoryComponent implements OnInit {
  categories: MenuItem[];

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService
  ) {
    this.categories = new Array<MenuItem>();
  }

  ngOnInit(): void {
    this.categoryService
      .list$()
      .pipe(first())
      .subscribe({
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
        error: (err) => {
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
