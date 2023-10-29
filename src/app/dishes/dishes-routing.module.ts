import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './components/detail/detail.component';
import { BrowseComponent } from './components/browse/browse.component';

const routes: Routes = [
  { path: 'dish/:id', component: DetailComponent },
  { path: 'browse', component: BrowseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DishesRoutingModule {}
