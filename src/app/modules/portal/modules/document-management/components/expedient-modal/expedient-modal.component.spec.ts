import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientModalComponent } from './expedient-modal.component';

xdescribe('ExpedientModalComponent', () => {
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
