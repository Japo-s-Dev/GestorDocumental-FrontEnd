import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientModalComponent } from './expedient-modal.component';

describe('ExpedientModalComponent', () => {
  let component: ExpedientModalComponent;
  let fixture: ComponentFixture<ExpedientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpedientModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpedientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
