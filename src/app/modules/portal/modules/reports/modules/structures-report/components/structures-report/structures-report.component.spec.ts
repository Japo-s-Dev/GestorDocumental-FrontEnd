import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructuresReportComponent } from './structures-report.component';

describe('StructuresReportComponent', () => {
  let component: StructuresReportComponent;
  let fixture: ComponentFixture<StructuresReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StructuresReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructuresReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
