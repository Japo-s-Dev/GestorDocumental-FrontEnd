import { TestBed } from '@angular/core/testing';

import { StructuresReportService } from './structures-report.service';

describe('StructuresReportService', () => {
  let service: StructuresReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructuresReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
