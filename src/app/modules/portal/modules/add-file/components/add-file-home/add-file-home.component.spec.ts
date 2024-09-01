import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AddFileHomeComponent } from './add-file-home.component';
import { Router, NavigationEnd } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';

describe('AddFileHomeComponent', () => {
  let component: AddFileHomeComponent;
  let fixture: ComponentFixture<AddFileHomeComponent>;
  let router: Router;
  let routerEventsSubject: Subject<any>;
  let translateService: TranslateService;

  const translateServiceMock = {
    currentLang: 'en',
    onLangChange: new EventEmitter<LangChangeEvent>(),
    use: jasmine.createSpy('use').and.returnValue(of('')),
    get: jasmine.createSpy('get').and.returnValue(of('translated label')),
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
      url: '/portal/add' // Simulate the current URL
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ AddFileHomeComponent ],
      imports: [
        ReactiveFormsModule, 
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: TranslateService, useValue: translateServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFileHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Prueba de inicialización del formulario
  it('should initialize the form with default values', () => {
    const form = component.form;
    expect(form).toBeDefined();
    expect(form.get('project')?.value).toBe('');
    expect(form.get('idLiquidacion')?.value).toBe('');
    expect(form.get('nombre')?.value).toBe('');
    expect(form.get('transaccion')?.value).toBe('');
    expect(form.get('departamento')?.value).toBe('');
    expect(form.get('fecha')?.value).toBe('');
    expect(form.get('status')?.value).toBe('');
  });

  // Prueba de recuperación de uploadedFileName desde localStorage
  it('should set uploadedFileName from localStorage', () => {
    const storedFileName = 'test-file.txt';
    localStorage.setItem('uploadedFile', storedFileName);
    
    component.ngOnInit(); // Forzar la inicialización de nuevo

    expect(component.uploadedFileName).toBe(storedFileName);
  });

  // Prueba de la función navigateToUpload
  it('should navigate to the upload document page', () => {
    component.navigateToUpload();

    expect(router.navigate).toHaveBeenCalledWith(['/portal/add/upload-document']);
  });

  // Prueba de guardar el estado del formulario en localStorage antes de navegar
  it('should save form state to localStorage before navigating to upload document page', () => {
    const formValue = {
      project: 'Proyecto X',
      idLiquidacion: '123',
      nombre: 'Nombre',
      transaccion: 'Transacción 1',
      departamento: 'Departamento 1',
      fecha: '2024-01-01',
      status: 'Activo'
    };
  
    component.form.setValue(formValue);
  
    component.navigateToUpload();
  
    const savedFormState = JSON.parse(localStorage.getItem('formState') || '{}');
    expect(savedFormState).toEqual(formValue);
  });

  // Prueba de eliminar uploadedFile de localStorage al guardar
  it('should remove uploadedFile from localStorage on save', () => {
    localStorage.setItem('uploadedFile', 'test-file.txt');
    component.uploadedFileName = 'test-file.txt';
    component.form.setValue({
      project: 'Proyecto X',
      idLiquidacion: '123',
      nombre: 'Nombre',
      transaccion: 'Transacción 1',
      departamento: 'Departamento 1',
      fecha: '2024-01-01',
      status: 'Activo'
    });
  
    component.onSave();
  
    expect(localStorage.getItem('uploadedFile')).toBeNull();
  });

  // Prueba de mostrar mensaje de error si el formulario no es válido o falta cargar archivo
  it('should set errorMessage if form is invalid or file is not uploaded', () => {
    component.form.setValue({
      project: '',
      idLiquidacion: '',
      nombre: '',
      transaccion: '',
      departamento: '',
      fecha: '',
      status: ''
    });
    component.uploadedFileName = null;

    component.onSave();

    expect(component.errorMessage).toBe("Por favor complete todos los campos y cargue un documento antes de guardar.");
  });

  // Prueba de reiniciar el formulario después de guardar
  it('should reset the form after saving', () => {
    component.form.setValue({
      project: 'Proyecto X',
      idLiquidacion: '123',
      nombre: 'Nombre',
      transaccion: 'Transacción 1',
      departamento: 'Departamento 1',
      fecha: '2024-01-01',
      status: 'Activo'
    });
    component.uploadedFileName = 'test-file.txt';
  
    component.onSave();
  
    expect(component.form.get('project')?.value).toBe('');
    expect(component.form.get('idLiquidacion')?.value).toBe('');
    expect(component.form.get('nombre')?.value).toBe('');
    expect(component.form.get('transaccion')?.value).toBe('');
    expect(component.form.get('departamento')?.value).toBe('');
    expect(component.form.get('fecha')?.value).toBe('');
    expect(component.form.get('status')?.value).toBe('');
  });
});
