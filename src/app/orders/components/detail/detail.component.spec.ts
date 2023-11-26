import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailComponent } from './detail.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Order } from 'src/app/shared/models/order.dto';
import { OrderLine } from 'src/app/shared/models/order-line.dto';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let router: Router;
  let order: Order;

  beforeAll(() => {
    order = new Order();
    order.ID = 5;
    order.OrderLines = [
      new OrderLine(1, 'Dish 1', 3.5, 1),
      new OrderLine(2, 'Dish 2', 7.5, 1),
    ];
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [HttpClient, MessageService],
    });
    router = TestBed.inject(Router);
    spyOn(router, 'getCurrentNavigation').and.returnValue({
      extras: { state: { order: order } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
