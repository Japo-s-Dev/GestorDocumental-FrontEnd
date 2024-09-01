import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AddFileHomeComponent } from './add-file-home.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('AddFileHomeComponent', () => {
  let component: AddFileHomeComponent;
  let fixture: ComponentFixture<AddFileHomeComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFileHomeComponent ],
      imports: [
        ReactiveFormsModule, 
        RouterTestingModule,
        TranslateModule.forRoot() // Importa TranslateModule para que el pipe 'translate' esté disponible
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFileHomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); // Inyecta el router
    fixture.detectChanges();
  });

  // Prueba de creación del componente
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
    spyOn(router, 'navigate');

    component.navigateToUpload();

    expect(router.navigate).toHaveBeenCalledWith(['/portal/add/upload-document']);
  });
});
