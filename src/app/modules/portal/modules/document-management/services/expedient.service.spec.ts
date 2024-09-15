import { TestBed } from '@angular/core/testing';

import { ExpedientService } from './expedient.service';

describe('ExpedientService', () => {
  let service: ExpedientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpedientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
