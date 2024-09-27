import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientListComponent } from './expedient-list.component';

xdescribe('ExpedientListComponent', () => {
  let component: ExpedientListComponent;
  let fixture: ComponentFixture<ExpedientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpedientListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpedientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
