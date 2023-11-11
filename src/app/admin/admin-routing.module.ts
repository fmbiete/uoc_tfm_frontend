import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent as AllergensComponent } from './components/allergens/list/list.component';
import { ListComponent as CategoriesComponent } from './components/categories/list/list.component';
import { ListComponent as IngredientsComponent } from './components/ingredients/list/list.component';
import { ListComponent as UsersComponent } from './components/users/list/list.component';
import { ListComponent as DishesListComponent } from './components/dishes/list/list.component';

const routes: Routes = [
  { path: 'allergens', component: AllergensComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'dishes', component: DishesListComponent },
  { path: 'ingredients', component: IngredientsComponent },
  { path: 'users', component: UsersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
