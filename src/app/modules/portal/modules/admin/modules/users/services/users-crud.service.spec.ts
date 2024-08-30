import { TestBed } from '@angular/core/testing';

import { UserCrudService } from './users-crud.service';

describe('UserCrudService', () => {
  let service: UserCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
