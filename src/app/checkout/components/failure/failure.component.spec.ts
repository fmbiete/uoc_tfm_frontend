import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailureComponent } from './failure.component';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

describe('FailureComponent', () => {
  let component: FailureComponent;
  let fixture: ComponentFixture<FailureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FailureComponent],
      providers: [HttpClient, MessageService],
    });
    fixture = TestBed.createComponent(FailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
