import { TestBed } from '@angular/core/testing';

import { AllergenService } from './allergen.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AllergenService', () => {
  let service: AllergenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClient],
    });
    service = TestBed.inject(AllergenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
