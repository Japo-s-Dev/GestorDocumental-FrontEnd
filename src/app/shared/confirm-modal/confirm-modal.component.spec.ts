import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirm-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;
  let activeModal: NgbActiveModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmModalComponent],
      providers: [NgbActiveModal], // Añadimos NgbActiveModal como proveedor
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal); // Inyectamos NgbActiveModal
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the message input', () => {
    const testMessage = 'Are you sure you want to proceed?';
    component.message = testMessage;
    fixture.detectChanges();

    const messageElement = fixture.debugElement.query(By.css('.modal-body'));
    expect(messageElement.nativeElement.textContent).toContain(testMessage);
  });

  it('should close the modal with "confirm" when confirm is called', () => {
    spyOn(activeModal, 'close');

    component.confirm();

    expect(activeModal.close).toHaveBeenCalledWith('confirm');
  });

  it('should dismiss the modal with "cancel" when cancel is called', () => {
    spyOn(activeModal, 'dismiss');

    component.cancel();

    expect(activeModal.dismiss).toHaveBeenCalledWith('cancel');
  });
});
