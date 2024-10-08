import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileModalComponent } from './profile-modal.component';

describe('ProfileModalComponent', () => {
  let component: ProfileModalComponent;
  let fixture: ComponentFixture<ProfileModalComponent>;
  let activeModal: NgbActiveModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileModalComponent],
      providers: [
        { provide: NgbActiveModal, useValue: jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with values from localStorage', () => {
    const userStatus = { username: 'testUser', role: 'ADMIN' };
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'userStatus') return JSON.stringify(userStatus);
      if (key === 'lastLogin') return '2024-09-25 10:00 AM';
      return null;
    });

    component.ngOnInit();

    expect(component.username).toBe('testUser');
    expect(component.role).toBe('ADMIN');
    expect(component.lastLogin).toBe('2024-09-25 10:00 AM');
    expect(component.roleIcon).toBe('fa-solid fa-user-tie');
    expect(component.roleStyle).toBe('admin-role');
  });

  it('should dismiss the modal when close is called', () => {
    component.close();
    expect(activeModal.dismiss).toHaveBeenCalled();
  });

  it('should close the modal with "exit" when exit is called', () => {
    component.exit();
    expect(activeModal.close).toHaveBeenCalledWith('exit');
  });

  it('should clear localStorage and close the modal with "logout" when logout is called', () => {
    spyOn(localStorage, 'removeItem');
    
    component.logout();
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('userStatus');
    expect(localStorage.removeItem).toHaveBeenCalledWith('lastLogin');
    expect(activeModal.close).toHaveBeenCalledWith('logout');
  });
});
