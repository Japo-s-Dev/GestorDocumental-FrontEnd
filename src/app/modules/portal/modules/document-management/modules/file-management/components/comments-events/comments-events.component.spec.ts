import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsEventsComponent } from './comments-events.component';

xdescribe('CommentsEventsComponent', () => {
  let component: CommentsEventsComponent;
  let fixture: ComponentFixture<CommentsEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentsEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
