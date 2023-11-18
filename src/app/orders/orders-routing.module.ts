import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { DetailComponent } from './components/detail/detail.component';

const routes: Routes = [
  { path: '', component: ListComponent, canActivate: [AuthGuard] },
  { path: 'detail', component: DetailComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
