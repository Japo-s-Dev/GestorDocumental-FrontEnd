import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { HomePortalComponent } from './home-portal.component';
import { TranslateModule, TranslateService, TranslateLoader, LangChangeEvent } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { TranslateFakeLoader } from '@ngx-translate/core';

describe('HomePortalComponent', () => {
  let component: HomePortalComponent;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let fixture: ComponentFixture<HomePortalComponent>;

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

  beforeEach(waitForAsync(() => {
    loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['hideLoader']);

    TestBed.configureTestingModule({
      declarations: [ HomePortalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } // Cargador falso
        })
      ],
      providers: [
        { provide: LoaderService, useValue: loaderServiceSpy },
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide the loader after 2 seconds in ngOnInit', fakeAsync(() => {
    component.ngOnInit();
    tick(2000);
    expect(loaderServiceSpy.hideLoader).toHaveBeenCalled();
  }));

  it('should return correct storage percentage', () => {
    const percentage = component.getStoragePercentage();
    expect(percentage).toBeCloseTo(30, 0);
  });

  it('should switch language and update currentLanguage', () => {
    const newLanguage = 'en';
    component.switchLanguage(newLanguage);
    fixture.detectChanges();
    expect(translateServiceMock.use).toHaveBeenCalledWith(newLanguage);
    expect(component.currentLanguage).toBe(newLanguage);
  });
});
