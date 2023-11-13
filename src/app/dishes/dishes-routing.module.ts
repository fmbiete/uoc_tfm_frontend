import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './components/detail/detail.component';
import { BrowseComponent } from './components/browse/browse.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  { path: 'dish/:id', component: DetailComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'search', component: SearchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DishesRoutingModule {}
