import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from '../list/list.component';
import { NewComponent } from '../new/new.component';
import { Category } from 'src/app/dishes/models/category.dto';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ListComponent, NewComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  newCategory!: Category;
}
