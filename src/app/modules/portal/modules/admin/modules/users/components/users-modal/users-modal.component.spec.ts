import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserCrudService } from '../../services/users-crud.service';
import { RolesCrudService } from '../../../roles/services/roles-crud.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { UsersModalComponent } from './users-modal.component';
import { IRole } from '../../../roles/interfaces/role.interface';
import { IUser } from '../../interfaces/user.interface';
import { CreateUserRequest } from '../../interfaces/create-user.interface';
import { UpdateUserRequest } from '../../interfaces/update-user.interface';

describe('UsersModalComponent', () => {
  let component: UsersModalComponent;
  let fixture: ComponentFixture<UsersModalComponent>;
  let userCrudService: jasmine.SpyObj<UserCrudService>;
  let rolesCrudService: jasmine.SpyObj<RolesCrudService>;
  let translateService: TranslateService;
  let activeModal: NgbActiveModal;

  beforeEach(async () => {
    userCrudService = jasmine.createSpyObj('UserCrudService', ['listUsers', 'createUser', 'updateUser']);
    rolesCrudService = jasmine.createSpyObj('RolesCrudService', ['listRoles']);
    
    // Asegúrate de que los métodos devuelvan un Observable como se espera
    userCrudService.listUsers.and.returnValue(of({ body: { result: [] } }));
    userCrudService.createUser.and.returnValue(of({})); // Simula la respuesta del servicio
    userCrudService.updateUser.and.returnValue(of({})); // Simula la respuesta del servicio
    rolesCrudService.listRoles.and.returnValue(of({ body: { result: [{ id: 1, role_name: 'User' }] } }));

    await TestBed.configureTestingModule({
      declarations: [UsersModalComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: UserCrudService, useValue: userCrudService },
        { provide: RolesCrudService, useValue: rolesCrudService },
        NgbActiveModal,
        TranslateService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersModalComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    activeModal = TestBed.inject(NgbActiveModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with user data when in edit mode', () => {
    const userData: IUser = { id: 1, username: 'testuser', email: 'test@example.com', assigned_role: 'User' };
    component.userData = userData;
    component.isEditMode = true;

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.userForm.get('username')?.value).toBe('testuser');
    expect(component.userForm.get('email')?.value).toBe('test@example.com');
    expect(component.userForm.get('assigned_role')?.value).toBe('User');
  });

  it('should show an alert if form is invalid when saving', fakeAsync(() => {
    spyOn(component, 'showAlert');
    spyOn(translateService, 'get').and.returnValue(of('Form is invalid'));

    component.save();

    tick();
    expect(component.showAlert).toHaveBeenCalledWith('Form is invalid');
  }));

  it('should show an alert if passwords do not match when creating a user', fakeAsync(() => {
    spyOn(component, 'showAlert');
    spyOn(translateService, 'get').and.returnValue(of('Passwords do not match'));

    component.isEditMode = false;
    component.userForm.setValue({
      username: 'testuser',
      password: 'password1',
      confirmPassword: 'password2',
      email: 'test@example.com',
      assigned_role: 'User'
    });

    component.save();

    tick();
    expect(component.showAlert).toHaveBeenCalledWith('Passwords do not match');
  }));

  it('should create a new user when form is valid and not in edit mode', fakeAsync(() => {
    spyOn(activeModal, 'close');
    component.isEditMode = false;
    component.userForm.setValue({
      username: 'newuser',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      email: 'new@example.com',
      assigned_role: 'User'
    });

    const expectedUser: CreateUserRequest = {
      username: 'newuser',
      pwd_clear: 'Password1!',
      email: 'new@example.com',
      assigned_role: 'User' // Añade esta línea
    };

    component.save();

    tick();
    fixture.detectChanges(); // Asegúrate de que los cambios se apliquen

    expect(userCrudService.createUser).toHaveBeenCalledWith(expectedUser);
    expect(activeModal.close).toHaveBeenCalledWith('created');
  
    tick(10000); // Avanza el tiempo para limpiar los temporizadores restantes
}));

  xit('should update an existing user when form is valid and in edit mode', fakeAsync(() => {
    spyOn(activeModal, 'close');
    component.userData = { id: 1, username: 'existinguser', email: 'existing@example.com', assigned_role: 'User' };
    component.isEditMode = true;
    component.userForm.setValue({
      username: 'updateduser',
      password: '',  // En modo edición, no necesitas la contraseña
      confirmPassword: '',
      email: 'updated@example.com',
      assigned_role: 'User'
    });

    const expectedUser: UpdateUserRequest = {
      username: 'updateduser',
      email: 'updated@example.com',
      assigned_role: 'User'
    };

    component.save();

    tick(); 
    fixture.detectChanges();

    expect(userCrudService.updateUser).toHaveBeenCalledWith(1, expectedUser);
    expect(activeModal.close).toHaveBeenCalledWith('updated');

    tick(10000); // Asegúrate de limpiar los temporizadores restantes
  }));

  it('should display alert when a duplicate username is entered', () => {
    component.existingUsers = [{ id: 1, username: 'duplicateUser', email: 'dup@example.com', assigned_role: 'User' }];
    const control = component.userForm.controls['username'];
    control.setValue('duplicateUser');

    expect(control.errors?.['usernameExists']).toBeTrue();
  });

  it('should display alert when a duplicate email is entered', () => {
    component.existingUsers = [{ id: 1, username: 'uniqueUser', email: 'duplicate@example.com', assigned_role: 'User' }];
    const control = component.userForm.controls['email'];
    control.setValue('duplicate@example.com');

    expect(control.errors?.['emailExists']).toBeTrue();
  });

  it('should not allow weak passwords', () => {
    const control = component.userForm.controls['password'];
    control.setValue('weak');

    expect(control.errors?.['passwordWeak']).toBeTruthy();
  });

  it('should show an alert and hide it after 10 seconds', fakeAsync(() => {
    component.showAlert('Test Alert');
    expect(component.alertMessage).toBe('Test Alert');
    expect(component.showWarningAlert).toBeTrue();

    tick(10000);
    expect(component.showWarningAlert).toBeFalse();
  }));

  it('should dismiss the modal when close is called', () => {
    spyOn(activeModal, 'dismiss');
    component.close();
    expect(activeModal.dismiss).toHaveBeenCalled();
  });
});
