import { TestBed } from '@angular/core/testing';

import { RolesCrudService } from './roles-crud.service';

describe('RolesCrudService', () => {
  let service: RolesCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
