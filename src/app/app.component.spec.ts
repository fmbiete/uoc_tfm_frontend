import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './landing/components/header/header.component';
import { FooterComponent } from './landing/components/footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HeaderComponent,
        FooterComponent,
        HttpClientTestingModule,
        MessagesModule,
      ],
      declarations: [AppComponent],
      providers: [HttpClient, MessageService],
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
