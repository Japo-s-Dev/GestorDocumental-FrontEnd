import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;
  let loaderService: LoaderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        HttpClientTestingModule // Agrega HttpClientTestingModule aquí
      ],
      providers: [
        AuthService,
        LoaderService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    loaderService = TestBed.inject(LoaderService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.value).toEqual({ username: '', password: '' });
  });

  it('should toggle password visibility', () => {
    expect(component.hide).toBeTrue();
    component.toggleVisibility();
    expect(component.hide).toBeFalse();
    component.toggleVisibility();
    expect(component.hide).toBeTrue();
  });

  it('should call login on form submit with valid credentials', () => {
    const mockResponse = new HttpResponse({
      body: { result: { success: true, username: 'testUser', role: 'admin' } },
      status: 200,
      statusText: 'OK',
      headers: new HttpHeaders(),
      url: ''
    });

    spyOn(authService, 'login').and.returnValue(of(mockResponse));
    spyOn(router, 'navigate');
    spyOn(loaderService, 'showLoader');

    component.loginForm.setValue({ username: 'testUser', password: 'testPassword' });
    component.login();

    expect(authService.login).toHaveBeenCalledWith({ username: 'testUser', pwd: 'testPassword' });
    expect(loaderService.showLoader).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/portal']);
  });

  it('should show alert on login failure', () => {
    spyOn(authService, 'login').and.returnValue(throwError({ status: 403, error: { message: 'Credenciales incorrectas' }})); 
    spyOn(component, 'showAlert');
    spyOn(loaderService, 'hideLoader');
  
    component.loginForm.setValue({ username: 'testUser', password: 'wrongPassword' });
    component.login();
  
    expect(component.showAlert).toHaveBeenCalledWith('Error', 'Credenciales incorrectas', 'danger');
    expect(loaderService.hideLoader).toHaveBeenCalled();
  });

  it('should show alert and close it after timeout', fakeAsync(() => {
    component.showAlert('Test Alert', 'Test message', 'info');
    expect(component.alertMessage).toBe('Test message');
    expect(component.alertVisible).toBeTrue();

    tick(10000); // Avanza el tiempo en 10000 ms
    expect(component.alertVisible).toBeFalse();
  }));

  it('should switch language', () => {
    const language = 'en';
    spyOn(component.translate, 'use');
    component.switchLanguage(language);
    expect(component.translate.use).toHaveBeenCalledWith(language);
    expect(component.currentLanguage).toBe(language);
  });
});
