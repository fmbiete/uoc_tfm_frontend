import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridItemComponent } from './grid-item.component';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

describe('GridItemComponent', () => {
  let component: GridItemComponent;
  let fixture: ComponentFixture<GridItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GridItemComponent],
      providers: [HttpClient, MessageService],
    });
    fixture = TestBed.createComponent(GridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
