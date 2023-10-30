import { TestBed } from '@angular/core/testing';

import { SnackbarService } from './snackbar.service';
import { MessageService } from 'primeng/api';

describe('SnackbarService', () => {
  let service: SnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService],
    });
    service = TestBed.inject(SnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
