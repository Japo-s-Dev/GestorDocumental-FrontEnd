import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsReportComponent } from './actions-report.component';

describe('ActionsReportComponent', () => {
  let component: ActionsReportComponent;
  let fixture: ComponentFixture<ActionsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionsReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
