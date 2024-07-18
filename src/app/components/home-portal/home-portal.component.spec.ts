import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePortalComponent } from './home-portal.component';

describe('HomePortalComponent', () => {
  let component: HomePortalComponent;
  let fixture: ComponentFixture<HomePortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePortalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
