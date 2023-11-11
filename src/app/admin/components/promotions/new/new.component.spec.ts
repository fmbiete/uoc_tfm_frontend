import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewComponent } from './new.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Dish } from 'src/app/shared/models/dish.dto';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('NewComponent', () => {
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        BrowserAnimationsModule,
        HttpClient,
        MessageService,
        { provide: DynamicDialogRef, useValue: {} },
        {
          provide: DynamicDialogConfig,
          useValue: { data: { dish: new Dish() } },
        },
      ],
    });
    fixture = TestBed.createComponent(NewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create promotion', () => {
    expect(component).toBeTruthy();
  });
});
