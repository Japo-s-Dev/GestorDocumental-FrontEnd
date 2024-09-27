import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserCrudService } from './users-crud.service';
import { AppConstants } from '../../../../../../../enums/app.constants';
import { CreateUserRequest } from '../interfaces/create-user.interface';
import { UpdateUserRequest } from '../interfaces/update-user.interface';
import { IDeleteUserRequest } from '../interfaces/delete-user.interface';

describe('UserCrudService', () => {
  let service: UserCrudService;
  let httpMock: HttpTestingController;

  const apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserCrudService],
    });
    service = TestBed.inject(UserCrudService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that no outstanding requests remain
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list users', () => {
    const mockUsers = [{ id: 1, username: 'user1', email: 'user1@example.com' }];

    service.listUsers().subscribe((response) => {
      expect(response.body.result).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    const payload = {
      id: 1,
      method: 'list_users',
      params: {}
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    expect(req.request.body.get('json')).toEqual(formData.get('json'));

    req.flush({ result: mockUsers });
  });

  it('should create a user', () => {
    const userData: CreateUserRequest = {
      username: 'newuser',
      email: 'newuser@example.com',
      pwd_clear: 'password123',
      assigned_role: 'User'
    };
    const mockResponse = { id: 1, ...userData };

    service.createUser(userData).subscribe((response) => {
      expect(response.body.result).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    const payload = {
      id: 1,
      method: 'create_user',
      params: { data: userData }
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    expect(req.request.body.get('json')).toEqual(formData.get('json'));

    req.flush({ result: mockResponse });
  });

  it('should update a user', () => {
    const userId = 1;
    const userData: UpdateUserRequest = {
      username: 'updateduser',
      email: 'updateduser@example.com',
      assigned_role: 'User'
    };

    service.updateUser(userId, userData).subscribe((response) => {
      expect(response.body.result).toEqual(userData);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    const payload = {
      id: 1,
      method: 'update_user',
      params: {
        id: userId,
        data: userData
      }
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    expect(req.request.body.get('json')).toEqual(formData.get('json'));

    req.flush({ result: userData });
  });

  it('should delete a user', () => {
    const userId = 1;

    service.deleteUser(userId).subscribe((response) => {
      expect(response.body.result).toEqual('User deleted');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    const payload: IDeleteUserRequest = {
      id: 1,
      method: 'delete_user',
      params: { id: userId }
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    expect(req.request.body.get('json')).toEqual(formData.get('json'));

    req.flush({ result: 'User deleted' });
  });
});
