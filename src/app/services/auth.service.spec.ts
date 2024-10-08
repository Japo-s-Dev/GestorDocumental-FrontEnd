import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AppConstants } from '../enums/app.constants';
import { HttpResponse } from '@angular/common/http';
import { LoginRequest, LogOffRequest } from '../interfaces/login-request.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform login and return an HttpResponse', () => {
    const mockLoginRequest: LoginRequest = {
      username: 'testUser',
      pwd: 'testPass' // Cambié 'password' a 'pwd' para que coincida con la interfaz
    };
  
    const mockResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: { token: 'testToken' }
    });
  
    service.login(mockLoginRequest).subscribe((response) => {
      expect(response.status).toBe(200);
      expect(response.body.token).toBe('testToken');
    });
  
    const req = httpTestingController.expectOne(`${AppConstants.BASE_URL}/api/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginRequest);
    req.event(mockResponse);
  });

  it('should perform logoff and return an HttpResponse', () => {
    const mockLogoffRequest: LogOffRequest = {
      logoff: true // O el valor que necesites para esta propiedad
    };
  
    const mockResponse = new HttpResponse({
      status: 200,
      statusText: 'OK'
    });
  
    spyOn(localStorage, 'clear');
  
    service.logoff(mockLogoffRequest).subscribe((response) => {
      expect(response.status).toBe(200);
      expect(localStorage.clear).toHaveBeenCalled();
    });
  
    const req = httpTestingController.expectOne(`${AppConstants.BASE_URL}/api/logoff`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLogoffRequest);
    req.event(mockResponse);
  });
});
