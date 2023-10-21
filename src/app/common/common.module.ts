import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';

@NgModule({
  declarations: [
    CarouselComponent,
    HomeComponent,
    AboutComponent
  ],
  imports: [CommonModule, HeaderComponent, FooterComponent],
})
export class CommonModule {}
