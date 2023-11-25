import {
  APP_INITIALIZER,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  NgModule,
  isDevMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpInterceptorService } from './shared/services/http-interceptor.service';
import { HeaderComponent } from './landing/components/header/header.component';
import { FooterComponent } from './landing/components/footer/footer.component';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import {
  initializeLanguage,
  initializeSupportedLocales,
} from './app.initializer';
import { CommonModule } from '@angular/common';
import { HeaderComponent as AdminMenubarComponent } from './admin/components/header/header.component';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    MessagesModule,
    AdminMenubarComponent,
    HeaderComponent,
    FooterComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    { provide: DEFAULT_CURRENCY_CODE, useValue: environment.currency },
    {
      provide: APP_INITIALIZER,
      useFactory: () => initializeLanguage,
      multi: true,
    },
    { provide: LOCALE_ID, useFactory: initializeSupportedLocales },
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
