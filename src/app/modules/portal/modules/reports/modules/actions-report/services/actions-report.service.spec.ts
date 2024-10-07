import { TestBed } from '@angular/core/testing';

import { ActionsReportService } from './actions-report.service';

describe('ActionsReportService', () => {
  let service: ActionsReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionsReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
