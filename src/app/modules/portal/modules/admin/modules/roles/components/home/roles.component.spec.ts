import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolesComponent } from './roles.component';
import { RolesCrudService } from '../../services/roles-crud.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../../../../../../services/loader.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IRole } from '../../interfaces/role.interface';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';
import { FormsModule } from '@angular/forms';

describe('RolesComponent', () => {
  let component: RolesComponent;
  let fixture: ComponentFixture<RolesComponent>;
  let rolesCrudService: jasmine.SpyObj<RolesCrudService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let loaderService: jasmine.SpyObj<LoaderService>;
  let translateService: TranslateService;

  beforeEach(async () => {
    // Creating mock services with their methods
    rolesCrudService = jasmine.createSpyObj('RolesCrudService', ['listRoles', 'deleteRole']);
    modalService = jasmine.createSpyObj('NgbModal', ['open']);
    loaderService = jasmine.createSpyObj('LoaderService', ['showLoader', 'hideLoader']);

    // Setting default return values for the mocks
    rolesCrudService.listRoles.and.returnValue(of({ body: { result: [] } }));
    rolesCrudService.deleteRole.and.returnValue(of({}));
    
    await TestBed.configureTestingModule({
      declarations: [RolesComponent],
      imports: [
        TranslateModule.forRoot(),
        FormsModule // Add FormsModule here
      ],
      providers: [
        { provide: RolesCrudService, useValue: rolesCrudService },
        { provide: NgbModal, useValue: modalService },
        { provide: LoaderService, useValue: loaderService },
        TranslateService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RolesComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);

    // Ensure the mock is ready before initializing the component
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load roles on init', () => {
    const mockRoles: IRole[] = [{ id: 1, role_name: 'Admin', description: 'Admin role' }];
    rolesCrudService.listRoles.and.returnValue(of({ body: { result: mockRoles } }));

    component.loadRoles(); // Trigger the method

    expect(rolesCrudService.listRoles).toHaveBeenCalled();
    expect(component.roles).toEqual(mockRoles);
  });

  it('should handle error when loading roles', () => {
    rolesCrudService.listRoles.and.returnValue(throwError('Error loading roles'));
    spyOn(component, 'showAlert');

    component.loadRoles();

    expect(component.showAlert).toHaveBeenCalled();
  });

  it('should open the modal when adding a new role', () => {
    const modalRefMock = {
      componentInstance: {},
      result: Promise.resolve('created'),
    } as NgbModalRef;

    modalService.open.and.returnValue(modalRefMock);

    component.addRole();

    expect(modalService.open).toHaveBeenCalledWith(RolesModalComponent);
  });

  it('should open the modal when editing an existing role', () => {
    const role: IRole = { id: 1, role_name: 'Test Role', description: 'Role description' };
    const modalRefMock = {
      componentInstance: {},
      result: Promise.resolve('updated'),
    } as NgbModalRef;

    modalService.open.and.returnValue(modalRefMock);

    component.editRole(role);

    expect(modalService.open).toHaveBeenCalledWith(RolesModalComponent);
  });

  it('should delete a role and show success alert', (done) => {
    spyOn(component, 'loadRoles');
    const mockRole: IRole = { id: 1, role_name: 'Admin', description: 'Admin role' };
    rolesCrudService.deleteRole.and.returnValue(of({}));

    const modalRefMock = {
      componentInstance: { message: '' }, // Ensure componentInstance is properly set
      result: Promise.resolve('confirm'),
    } as NgbModalRef;

    modalService.open.and.returnValue(modalRefMock);

    component.deleteRole(mockRole);

    setTimeout(() => {
      expect(rolesCrudService.deleteRole).toHaveBeenCalledWith(mockRole.id);
      expect(component.loadRoles).toHaveBeenCalled();
      expect(component.alertVisible).toBeTrue();
      expect(component.alertType).toBe('alert-info');
      done();
    }, 100);
  });

  it('should handle error when deleting a role', (done) => {
    spyOn(component, 'showAlert');
    const mockRole: IRole = { id: 1, role_name: 'Admin', description: 'Admin role' };
    rolesCrudService.deleteRole.and.returnValue(throwError('Error deleting role'));

    const modalRefMock = {
      componentInstance: { message: '' }, // Ensure componentInstance is properly set
      result: Promise.resolve('confirm'),
    } as NgbModalRef;

    modalService.open.and.returnValue(modalRefMock);

    component.deleteRole(mockRole);

    setTimeout(() => {
      expect(component.showAlert).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should filter roles by search term', () => {
    component.roles = [
      { id: 1, role_name: 'Admin', description: 'Admin role' },
      { id: 2, role_name: 'User', description: 'User role' },
    ];
    component.searchTerm = 'Admin';

    const filteredRoles = component.filteredRoles();

    expect(filteredRoles.length).toBe(1);
    expect(filteredRoles[0].role_name).toBe('Admin');
  });

  it('should display an alert with the correct parameters', () => {
    const title = 'Title';
    const message = 'Message';
    const type = 'success';

    component.showAlert(title, message, type);

    expect(component.alertTitle).toBe(title);
    expect(component.alertMessage).toBe(message);
    expect(component.alertType).toBe('alert-success');
    expect(component.alertVisible).toBeTrue();
  });

  it('should handle closing of alerts', () => {
    component.showAlert('Title', 'Message', 'info');
    component.handleAlertClosed();

    expect(component.alertVisible).toBeFalse();
  });
});
