import { TestBed } from '@angular/core/testing';

import { ProjectsCrudService } from './projects-crud.service';

describe('ProjectsCrudService', () => {
  let service: ProjectsCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
