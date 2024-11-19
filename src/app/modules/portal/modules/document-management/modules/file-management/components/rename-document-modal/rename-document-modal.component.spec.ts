import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameDocumentModalComponent } from './rename-document-modal.component';

describe('RenameDocumentModalComponent', () => {
  let component: RenameDocumentModalComponent;
  let fixture: ComponentFixture<RenameDocumentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenameDocumentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenameDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
