import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { HttpResponse, HttpHeaders, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { ParameterManagerService } from '../../services/parameter-manager.service';
import { LoaderService } from '../../services/loader.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;
  let loaderService: LoaderService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [LoginComponent],
    imports: [ReactiveFormsModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot()],
    providers: [
        AuthService,
        ParameterManagerService,
        LoaderService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    loaderService = TestBed.inject(LoaderService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
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
      body: { result: { success: true, username: 'testUser' } },
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
    spyOn(authService, 'login').and.returnValue(throwError({ status: 401 }));
    spyOn(component, 'showAlert');
    spyOn(loaderService, 'hideLoader');

    component.loginForm.setValue({ username: 'testUser', password: 'wrongPassword' });
    component.login();

    expect(component.showAlert).toHaveBeenCalledWith('Credenciales incorrectas');
    expect(loaderService.hideLoader).toHaveBeenCalled();
  });

  it('should show alert and close it after timeout', fakeAsync(() => {
    component.showAlert('Test Alert');
    expect(component.alertMessage).toBe('Test Alert');
    expect(component.showWarningAlert).toBeTrue();

    tick(10000); // Avanza el tiempo en 10000 ms (el tiempo definido en setTimeout)
    expect(component.showWarningAlert).toBeFalse();
  }));

  it('should show alert and hide loader on login failure', fakeAsync(() => {
    spyOn(authService, 'login').and.returnValue(throwError({ status: 401 }));
    spyOn(component, 'showAlert');
    spyOn(loaderService, 'hideLoader');
  
    component.loginForm.setValue({ username: 'testUser', password: 'wrongPassword' });
    component.login();
  
    // Avanzar el tiempo para asegurar que se complete cualquier temporizador si es necesario
    tick();
  
    expect(component.showAlert).toHaveBeenCalledWith('Credenciales incorrectas');
    expect(loaderService.hideLoader).toHaveBeenCalled();
  }));

  it('should switch language', () => {
    const language = 'en';
    spyOn(component.translate, 'use');
    component.switchLanguage(language);
    expect(component.translate.use).toHaveBeenCalledWith(language);
    expect(component.currentLanguage).toBe(language);
  });
});
