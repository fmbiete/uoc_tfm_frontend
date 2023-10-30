import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent as AdminCategoryListComponent } from 'src/app/admin/components/category/list/list.component';

@Component({
  selector: 'common-home-admin',
  standalone: true,
  imports: [CommonModule, AdminCategoryListComponent],
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss'],
})
export class HomeAdminComponent {}
