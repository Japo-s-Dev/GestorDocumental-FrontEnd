import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { FormsModule } from '@angular/forms';
import { UserCrudService } from '../../services/users-crud.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../../../../../../services/loader.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { UsersModalComponent } from '../users-modal/users-modal.component';
import { ConfirmModalComponent } from '../../../../../../../../shared/confirm-modal/confirm-modal.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let userCrudService: jasmine.SpyObj<UserCrudService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let loaderService: jasmine.SpyObj<LoaderService>;
  let translateService: TranslateService;

  beforeEach(async () => {
    userCrudService = jasmine.createSpyObj('UserCrudService', ['listUsers', 'deleteUser']);
    modalService = jasmine.createSpyObj('NgbModal', ['open']);
    loaderService = jasmine.createSpyObj('LoaderService', ['showLoader', 'hideLoader']);
    userCrudService.listUsers.and.returnValue(of({ body: { result: [] } }));
    userCrudService.deleteUser.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      imports: [FormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: UserCrudService, useValue: userCrudService },
        { provide: NgbModal, useValue: modalService },
        { provide: LoaderService, useValue: loaderService },
        TranslateService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on initialization', () => {
    const mockUsers = [{ id: 1, username: 'testuser', email: 'test@example.com', assigned_role: 'Admin' }];
    userCrudService.listUsers.and.returnValue(of({ body: { result: mockUsers } }));

    component.loadUsers();
    expect(userCrudService.listUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it('should handle error when loading users', () => {
    spyOn(component, 'showAlert');
    userCrudService.listUsers.and.returnValue(throwError('Error loading users'));
    spyOn(translateService, 'get').and.callFake((key) => {
      if (key === 'users:error_loading_title') return of('Error loading users');
      if (key === 'users:error_loading_message') return of('An error occurred while loading users');
      return of('');
    });

    component.loadUsers();
    expect(component.showAlert).toHaveBeenCalledWith(
      { title: 'Error loading users', message: 'An error occurred while loading users' },
      'danger'
    );
  });

  it('should open the user modal for adding a new user', () => {
    const modalRefMock = {
      componentInstance: {},
      result: Promise.resolve('created'),
    };
    modalService.open.and.returnValue(modalRefMock as any);

    component.addUser();
    expect(modalService.open).toHaveBeenCalledWith(UsersModalComponent);
  });

  it('should open the user modal for editing an existing user', () => {
    const user = { id: 1, username: 'testuser', email: 'test@example.com', assigned_role: 'Admin' };
    const modalRefMock = {
      componentInstance: {},
      result: Promise.resolve('updated'),
    };
    modalService.open.and.returnValue(modalRefMock as any);

    component.editUser(user);
    expect(modalService.open).toHaveBeenCalledWith(UsersModalComponent);
  });

  it('should delete a user and reload the list', fakeAsync(() => {
    const mockUser = { id: 2, username: 'deleteUser', email: 'delete@example.com', assigned_role: 'User' };
    spyOn(component, 'showAlert');
    spyOn(component, 'loadUsers');
  
    const modalRefMock = {
      componentInstance: {},
      result: Promise.resolve('confirm'),
    };
    modalService.open.and.returnValue(modalRefMock as any);
  
    component.deleteUser(mockUser);
    tick(); // Advance time to handle modal resolution
    fixture.detectChanges();
  
    expect(userCrudService.deleteUser).toHaveBeenCalledWith(mockUser.id);
    expect(component.showAlert).toHaveBeenCalled();
    expect(component.loadUsers).toHaveBeenCalled();
  
    tick(1000); // Advance time to handle the loaderService.hideLoader() timeout
  }));

  it('should show an error when trying to delete the logged-in user', () => {
    component.loggedInUsername = 'loggedUser';
    const mockUser = { id: 1, username: 'loggedUser', email: 'logged@example.com', assigned_role: 'Admin' };
    spyOn(component, 'showAlert');
  
    // Mock translation results
    spyOn(translateService, 'get').and.callFake((key) => {
      if (key === 'users:delete_error_logged_in_title') return of('Error');
      if (key === 'users:delete_error_logged_in_message') return of('You cannot delete the currently logged-in user');
      return of('');
    });
  
    component.deleteUser(mockUser);
  
    expect(component.showAlert).toHaveBeenCalledWith(
      { title: 'Error', message: 'You cannot delete the currently logged-in user' },
      'danger'
    );
  });  

  it('should filter users based on the search term', () => {
    component.users = [
      { id: 1, username: 'admin', email: 'admin@example.com', assigned_role: 'Admin' },
      { id: 2, username: 'user', email: 'user@example.com', assigned_role: 'User' },
    ];
    component.searchTerm = 'admin';

    const filteredUsers = component.filteredUsers();
    expect(filteredUsers.length).toBe(1);
    expect(filteredUsers[0].username).toBe('admin');
  });

  it('should display alert and close it after a specified time', fakeAsync(() => {
    component.showAlert({ title: 'Test Title', message: 'Test Message' }, 'info');
    expect(component.alertVisible).toBeTrue();
    expect(component.alertTitle).toBe('Test Title');
    expect(component.alertMessage).toBe('Test Message');
    tick(7000);
    expect(component.alertVisible).toBeFalse();
  }));
});
