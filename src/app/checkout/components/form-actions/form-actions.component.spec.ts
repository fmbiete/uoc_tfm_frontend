import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormActionsComponent } from './form-actions.component';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

describe('FormActionsComponent', () => {
  let component: FormActionsComponent;
  let fixture: ComponentFixture<FormActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [HttpClient, MessageService],
    });
    fixture = TestBed.createComponent(FormActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
