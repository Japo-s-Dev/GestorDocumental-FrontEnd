import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RolesCrudService } from '../../services/roles-crud.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { RolesModalComponent } from './roles-modal.component';
import { IRole } from '../../interfaces/role.interface';

describe('RolesModalComponent', () => {
  let component: RolesModalComponent;
  let fixture: ComponentFixture<RolesModalComponent>;
  let rolesCrudService: jasmine.SpyObj<RolesCrudService>;
  let translateService: TranslateService;
  let activeModal: NgbActiveModal;

  beforeEach(async () => {
    rolesCrudService = jasmine.createSpyObj('RolesCrudService', ['listRoles', 'createRole', 'updateRole']);
    rolesCrudService.listRoles.and.returnValue(of({ body: { result: [] } }));
    rolesCrudService.createRole.and.returnValue(of({}));
    rolesCrudService.updateRole.and.returnValue(of({}));

     // Mocking the NgbActiveModal
  spyOn(NgbActiveModal.prototype, 'close').and.callThrough();
  spyOn(NgbActiveModal.prototype, 'dismiss').and.callThrough();

    await TestBed.configureTestingModule({
      declarations: [RolesModalComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: RolesCrudService, useValue: rolesCrudService },
        NgbActiveModal,
        TranslateService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RolesModalComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    activeModal = TestBed.inject(NgbActiveModal);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with role data when in edit mode', () => {
    const roleData: IRole = { id: 1, role_name: 'Test Role', description: 'Test Description' };
    component.roleData = roleData;
    component.isEditMode = true;

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.roleForm.get('role_name')?.value).toBe('Test Role');
    expect(component.roleForm.get('description')?.value).toBe('Test Description');
  });

  it('should load existing roles on init', () => {
    const mockRoles: IRole[] = [{ id: 1, role_name: 'Admin', description: 'Admin role' }];
    rolesCrudService.listRoles.and.returnValue(of({ body: { result: mockRoles } }));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.existingRoles).toEqual(mockRoles);
  });

  it('should mark form controls as touched and show error when form is invalid', fakeAsync(() => {
    spyOn(component, 'showAlert');
    spyOn(translateService, 'get').and.returnValue(of('Please complete the form correctly'));

    component.save();

    tick();
    fixture.detectChanges();

    expect(component.roleForm.touched).toBeTrue();
    expect(component.showAlert).toHaveBeenCalledWith('Please complete the form correctly');
  }));

  it('should create a new role when form is valid and not in edit mode', fakeAsync(() => {
    component.roleForm.setValue({
      role_name: 'New Role',
      description: 'Description of new role'
    });
    component.isEditMode = false;
    
    component.save();
    
    tick();
    fixture.detectChanges();
    
    expect(rolesCrudService.createRole).toHaveBeenCalledWith({
      role_name: 'New Role',
      description: 'Description of new role'
    });
    expect(activeModal.close).toHaveBeenCalledWith('created');
  }));

  it('should update an existing role when form is valid and in edit mode', fakeAsync(() => {
    component.roleData = { id: 1, role_name: 'Existing Role', description: 'Existing description' };
    component.isEditMode = true;
    component.roleForm.setValue({
      role_name: 'Updated Role',
      description: 'Updated description'
    });
    
    component.save();
    
    tick();
    fixture.detectChanges();
    
    expect(rolesCrudService.updateRole).toHaveBeenCalledWith(1, {
      role_name: 'Updated Role',
      description: 'Updated description'
    });
    expect(activeModal.close).toHaveBeenCalledWith('updated');
  }));

  it('should handle error when updating a role', fakeAsync(() => {
    spyOn(component, 'showAlert');
    spyOn(translateService, 'get').and.returnValue(of('Error updating role'));
    rolesCrudService.updateRole.and.returnValue(throwError('Error'));

    component.roleData = { id: 1, role_name: 'Existing Role', description: 'Existing description' };
    component.isEditMode = true;
    component.roleForm.setValue({
      role_name: 'Updated Role',
      description: 'Updated description'
    });
    
    component.save();
    
    tick();
    fixture.detectChanges();

    expect(component.showAlert).toHaveBeenCalledWith('Error updating role');
  }));

  it('should handle error when creating a role', fakeAsync(() => {
    spyOn(component, 'showAlert');
    spyOn(translateService, 'get').and.returnValue(of('Error creating role'));
    rolesCrudService.createRole.and.returnValue(throwError('Error'));

    component.roleForm.setValue({
      role_name: 'New Role',
      description: 'Description of new role'
    });
    component.isEditMode = false;
    
    component.save();
    
    tick();
    fixture.detectChanges();

    expect(component.showAlert).toHaveBeenCalledWith('Error creating role');
  }));

  it('should dismiss the modal when close is called', () => {
    // spyOn(activeModal, 'dismiss');
    component.close();
    expect(activeModal.dismiss).toHaveBeenCalled();
  });

  it('should show alert and hide it after 10 seconds', fakeAsync(() => {
    component.showAlert('This is a test alert');
    expect(component.alertMessage).toBe('This is a test alert');
    expect(component.showWarningAlert).toBeTrue();

    tick(10000);
    expect(component.showWarningAlert).toBeFalse();
  }));

  it('should not allow the role name "ADMIN"', () => {
    const control = component.roleForm.controls['role_name'];
    control.setValue('ADMIN');
    expect(component.roleForm.get('role_name')?.errors?.['adminNameNotAllowed']).toBeTrue();
  });

  it('should detect duplicate role names', () => {
    component.existingRoles = [{ id: 1, role_name: 'Test Role', description: 'Test Description' }];
    const control = component.roleForm.controls['role_name'];
    control.setValue('Test Role');
    
    expect(component.roleForm.get('role_name')?.errors?.['duplicateName']).toBeTrue();
  });
});
