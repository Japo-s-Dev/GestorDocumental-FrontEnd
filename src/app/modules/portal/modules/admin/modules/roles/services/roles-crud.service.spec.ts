import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RolesCrudService } from './roles-crud.service';
import { AppConstants } from '../../../../../../../enums/app.constants';

describe('RolesCrudService', () => {
  let service: RolesCrudService;
  let httpMock: HttpTestingController;

  const apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RolesCrudService],
    });
    service = TestBed.inject(RolesCrudService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that no outstanding requests remain
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list roles', () => {
    const mockRoles = [{ id: 1, role_name: 'Admin' }];

    service.listRoles().subscribe((response) => {
      expect(response.body.result).toEqual(mockRoles);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    const payload = {
      id: 1,
      method: 'list_roles',
      params: {},
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    expect(req.request.body.get('json')).toEqual(formData.get('json'));

    req.flush({ result: mockRoles });
  });

  it('should create a role', () => {
    const roleData = { role_name: 'New Role' };
    const mockResponse = { id: 1, role_name: 'New Role' };

    service.createRole(roleData).subscribe((response) => {
      expect(response.body.result).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    const payload = {
      id: 1,
      method: 'create_role',
      params: { data: roleData },
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    expect(req.request.body.get('json')).toEqual(formData.get('json'));

    req.flush({ result: mockResponse });
  });

  it('should update a role', () => {
    const roleId = 1;
    const roleData = { role_name: 'Updated Role' };

    service.updateRole(roleId, roleData).subscribe((response) => {
      expect(response.body.result).toEqual(roleData);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    const payload = {
      id: 1,
      method: 'update_role',
      params: { id: roleId, data: roleData },
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    expect(req.request.body.get('json')).toEqual(formData.get('json'));

    req.flush({ result: roleData });
  });

  it('should delete a role', () => {
    const roleId = 1;

    service.deleteRole(roleId).subscribe((response) => {
      expect(response.body.result).toEqual('Role deleted');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    const payload = {
      id: 1,
      method: 'delete_role',
      params: { id: roleId },
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    expect(req.request.body.get('json')).toEqual(formData.get('json'));

    req.flush({ result: 'Role deleted' });
  });
});
