import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);

    // Limpiar sessionStorage antes de cada prueba
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save the token in sessionStorage', () => {
    const token = 'test-token';
    service.saveToken(token);

    expect(sessionStorage.getItem('auth-token')).toBe(token);
  });

  it('should get the token from sessionStorage', () => {
    const token = 'test-token';
    sessionStorage.setItem('auth-token', token);

    expect(service.getToken()).toBe(token);
  });

  it('should clear the token from sessionStorage', () => {
    sessionStorage.setItem('auth-token', 'test-token');
    service.clearToken();

    expect(sessionStorage.getItem('auth-token')).toBeNull();
  });

  it('should return true if token is present when calling isLoggedIn', () => {
    sessionStorage.setItem('auth-token', 'test-token');

    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if token is not present when calling isLoggedIn', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });
});
