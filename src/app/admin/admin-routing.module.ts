import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent as AllergensComponent } from './components/allergens/list/list.component';
import { ListComponent as CategoriesComponent } from './components/categories/list/list.component';
import { ListComponent as IngredientsComponent } from './components/ingredients/list/list.component';

const routes: Routes = [
  { path: 'allergens', component: AllergensComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'ingredients', component: IngredientsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
