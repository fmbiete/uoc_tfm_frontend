import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent as CategoriesComponent } from './components/categories/list/list.component';

const routes: Routes = [{ path: 'categories', component: CategoriesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
