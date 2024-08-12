import { TestBed } from '@angular/core/testing';

import { ParameterManagerService } from './parameter-manager.service';

describe('ParameterManagerService', () => {
  let service: ParameterManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParameterManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
