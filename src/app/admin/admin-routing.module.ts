import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthAdminGuard } from '../shared/guards/auth-admin.guard';
import { ListComponent as AllergensComponent } from './components/allergens/list/list.component';
import { ListComponent as CategoriesComponent } from './components/categories/list/list.component';
import { ListComponent as IngredientsComponent } from './components/ingredients/list/list.component';
import { ListComponent as UsersComponent } from './components/users/list/list.component';
import { ListComponent as DishesListComponent } from './components/dishes/list/list.component';
import { ListComponent as PromotionsComponent } from './components/promotions/list/list.component';
import { ListComponent as OrdersComponent } from './components/orders/list/list.component';

const routes: Routes = [
  {
    path: 'allergens',
    component: AllergensComponent,
    canActivate: [AuthAdminGuard],
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [AuthAdminGuard],
  },
  {
    path: 'dishes',
    component: DishesListComponent,
    canActivate: [AuthAdminGuard],
  },
  {
    path: 'ingredients',
    component: IngredientsComponent,
    canActivate: [AuthAdminGuard],
  },
  {
    path: 'orders/:todayOnly',
    component: OrdersComponent,
    canActivate: [AuthAdminGuard],
  },
  {
    path: 'promotions/:activeOnly',
    component: PromotionsComponent,
    canActivate: [AuthAdminGuard],
  },
  { path: 'users', component: UsersComponent, canActivate: [AuthAdminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
