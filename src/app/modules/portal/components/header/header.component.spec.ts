import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService, TranslateModule, LangChangeEvent } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { LoaderService } from '../../../../services/loader.service';
import { HeaderComponent } from './header.component';
import { RouteLabels } from '../../../../core/route-labels';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let translateService: TranslateService;
  let authService: AuthService;
  let loaderService: LoaderService;
  let routerEventsSubject: Subject<any>;

  const translateServiceMock = {
    currentLang: 'en',
    onLangChange: new EventEmitter<LangChangeEvent>(),
    use: jasmine.createSpy('use').and.returnValue(of('')),  // Esto está bien
    get: jasmine.createSpy('get').and.returnValue(of('translated label')),  // Esto está bien
    getDefaultLang: jasmine.createSpy('getDefaultLang').and.returnValue('en'),
    setDefaultLang: jasmine.createSpy('setDefaultLang').and.returnValue('es'),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter(),
  };

  beforeEach(async () => {
    // Create a mock for Router and its events
    routerEventsSubject = new Subject<NavigationEnd>();
    router = {
      events: routerEventsSubject.asObservable(),
      navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)),
      url: '/portal/search' // Simulate the current URL
    } as any;

    authService = {
      logoff: jasmine.createSpy('logoff').and.returnValue(of({}))
    } as any;

    loaderService = {
      showLoader: jasmine.createSpy('showLoader'),
      hideLoader: jasmine.createSpy('hideLoader')
    } as any;

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [HeaderComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: AuthService, useValue: authService },
        { provide: LoaderService, useValue: loaderService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  // Esto se asegura de que los bindings se actualicen
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update label on navigation end', () => {
    routerEventsSubject.next(new NavigationEnd(1, '/portal/search', '/portal/search'));
    fixture.detectChanges();
  
    expect(translateServiceMock.get).toHaveBeenCalledWith('route:search_criteria');
    expect(component.currentLabel).toBe('translated label');
  });

  it('should toggle user menu', () => {
    expect(component.userMenuOpen).toBeFalse();
    component.toggleUserMenu();
    expect(component.userMenuOpen).toBeTrue();
    component.toggleUserMenu();
    expect(component.userMenuOpen).toBeFalse();
  });

  it('should close user menu when clicking outside', () => {
    const fakeEvent = { target: document.createElement('div') } as unknown as MouseEvent;
    component.userMenuOpen = true;
    component.onClickOutside(fakeEvent);
    expect(component.userMenuOpen).toBeFalse();
  });

  it('should navigate to profile when viewProfile is called', () => {
    component.viewProfile();
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should log out and navigate to login', () => {
    component.logout();
    expect(authService.logoff).toHaveBeenCalled();
    expect(loaderService.showLoader).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should switch language and update currentLanguage', () => {
    component.switchLanguage('en');
    expect(translateServiceMock.use).toHaveBeenCalledWith('en');
    expect(component.currentLanguage).toBe('en');
  });

  it('should update label on language change', () => {
    const langChangeEvent: LangChangeEvent = { lang: 'en', translations: {} };
    translateServiceMock.onLangChange.emit(langChangeEvent);  // Asegúrate de usar el mock
    fixture.detectChanges();

    expect(translateServiceMock.get).toHaveBeenCalledWith('route:search_criteria');
    expect(component.currentLabel).toBe('translated label');
  });
});
