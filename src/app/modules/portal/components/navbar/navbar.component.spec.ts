import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService, LangChangeEvent, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../../services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { TranslateFakeLoader } from '@ngx-translate/core';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;
  let translate: TranslateService;
  let authService: AuthService;

  beforeEach(async () => {
    // Mock services 
    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    const translateServiceMock = {
      currentLang: 'en',
      onLangChange: new EventEmitter<LangChangeEvent>(),
      use: jasmine.createSpy('use').and.returnValue(of('')),
      get: jasmine.createSpy('get').and.returnValue(of('')),
      getDefaultLang: jasmine.createSpy('getDefaultLang').and.returnValue('en'), // Simula getDefaultLang,
      setDefaultLang: jasmine.createSpy('getDefaultLang').and.returnValue('es'), // Simula getDefaultLang
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter(),
    };

    const authServiceMock = {};

    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } // Cargador falso
        })
      ],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    translate = TestBed.inject(TranslateService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentLanguage with default language', () => {
    expect(component.currentLanguage).toBe('en');
    expect(translate.getDefaultLang).toHaveBeenCalled();
    expect(translate.setDefaultLang).toHaveBeenCalledWith('en');
  });

  it('should toggle showAdd and hide showSearch', () => {
    component.showAdd = false;
    component.showSearch = true;
    component.toggleAdd('some/path');
    expect(component.showAdd).toBeTrue();
    expect(component.showSearch).toBeFalse();
  });

  it('should toggle showSearch, navigate to the path and hide showAdd', () => {
    component.showAdd = true;
    component.showSearch = false;
    component.toggleSearch('some/path');
    expect(component.showSearch).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['some/path']);
    expect(component.showAdd).toBeFalse();
  });

  it('should toggle showAdmin', () => {
    component.showAdmin = false;
    component.toggleAdmin();
    expect(component.showAdmin).toBeTrue();
  });

  it('should navigate to the given path', () => {
    component.navigate('some/path');
    expect(router.navigate).toHaveBeenCalledWith(['some/path']);
  });

  it('should switch language and update currentLanguage', () => {
    component.switchLanguage('en');
    expect(translate.use).toHaveBeenCalledWith('en');
    expect(component.currentLanguage).toBe('en');
  });
});
