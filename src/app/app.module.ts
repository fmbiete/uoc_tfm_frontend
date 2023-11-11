import {
  APP_INITIALIZER,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  NgModule,
  isDevMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpInterceptorService } from './shared/services/http-interceptor.service';
import { HeaderComponent } from './common/components/header/header.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import {
  initializeLanguage,
  initializeSupportedLocales,
} from './app.initializer';
import { CommonModule } from '@angular/common';
import { MenubarComponent as AdminMenubarComponent } from './admin/components/menubar/menubar.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdminMenubarComponent,
    HeaderComponent,
    FooterComponent,
    MessagesModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
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
