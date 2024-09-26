import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadDocumentComponent } from './upload-document.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import mammoth from 'mammoth';

describe('UploadDocumentComponent', () => {
  let component: UploadDocumentComponent;
  let fixture: ComponentFixture<UploadDocumentComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadDocumentComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot()
      ],
    }).compileComponents();
    
    fixture = TestBed.createComponent(UploadDocumentComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Restablece el estado después de cada prueba
    localStorage.removeItem('uploadedFile');
    component.selectedFile = null;
    component.fileUploaded = false;
    component.filePreviewUrl = null;
  });

  beforeEach(() => {
    // Limpia el localStorage antes de cada prueba
    localStorage.clear();
    fixture = TestBed.createComponent(UploadDocumentComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    localStorage.setItem('uploadedFile', ''); // Asegura que la clave exista pero esté vacía
    fixture.detectChanges();
    
    expect(component.selectedFile).toBeNull();
    expect(component.fileUploaded).toBeFalse();
    expect(component.filePreviewUrl).toBeNull();
  });

  it('should update selectedFile and fileUploaded when a file is selected', () => {
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });
    const event = { target: { files: [file] } };

    component.onFileSelected(event as any);

    expect(component.selectedFile).toBe(file);
    expect(component.fileUploaded).toBeTrue();
  });

  it('should set filePreviewUrl for PDF files', () => {
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const event = { target: { files: [file] } };
  
    component.onFileSelected(event as any);
  
    expect(component.filePreviewUrl).toBeTruthy(); // Verifica que filePreviewUrl esté definido
    const sanitizedUrl = component.filePreviewUrl as any;
    expect(sanitizedUrl.changingThisBreaksApplicationSecurity).toContain('blob:');
  });

  it('should not set filePreviewUrl for non-PDF files', () => {
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [file] } };

    component.onFileSelected(event as any);

    expect(component.filePreviewUrl).toBeNull();
  });

  it('should navigate to the correct route on saveDocument', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const file = new File([''], 'test.pdf');
    component.selectedFile = file;

    component.saveDocument();

    expect(localStorage.getItem('uploadedFile')).toBe(file.name);
    expect(navigateSpy).toHaveBeenCalledWith(['/portal/add/file-entry']);
  });

  it('should not navigate or save if no file is selected', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.saveDocument();

    expect(localStorage.getItem('uploadedFile')).toBeNull();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should set filePreviewContent for Excel files', (done) => {
    const file = new File(['dummy content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const event = { target: { files: [file] } };
  
    component.onFileSelected(event as any);
  
    const reader = new FileReader();
    reader.onload = () => {
      expect(component.filePreviewContent).toContain('[['); // Verificamos que el contenido tenga el formato JSON
      done();
    };
    reader.readAsArrayBuffer(file);
  });

  it('should set filePreviewContent for Word files', (done) => {
    const file = new File(['dummy content'], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const event = { target: { files: [file] } };
  
    spyOn(mammoth, 'extractRawText').and.returnValue(Promise.resolve({ value: 'line1\nline2\nline3\nline4\nline5\nline6', messages: [] }));
  
    component.onFileSelected(event as any);
  
    setTimeout(() => {
      expect(component.filePreviewContent).toBe('line1\nline2\nline3\nline4\nline5');
      done();
    }, 100); // Espera a que la promesa de mammoth se resuelva
  });
  
  it('should set filePreviewContent for text files', (done) => {
    const file = new File(['line1\nline2\nline3\nline4\nline5\nline6'], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [file] } };
  
    component.onFileSelected(event as any);
  
    // Espera a que el FileReader complete la lectura del archivo
    setTimeout(() => {
      expect(component.filePreviewContent).toBe('line1\nline2\nline3\nline4\nline5');
      done(); // Llama a done() para indicar que la prueba ha terminado
    }, 100); // Espera un tiempo suficiente para que el FileReader complete la lectura
  });
  
  it('should set filePreviewUrl for image files', () => {
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } };
  
    component.onFileSelected(event as any);
  
    expect(component.filePreviewUrl).toBeTruthy(); // Verifica que filePreviewUrl esté definido
    const sanitizedUrl = component.filePreviewUrl as any;
    expect(sanitizedUrl.changingThisBreaksApplicationSecurity).toContain('blob:');
  });
  
  it('should set a default message for unsupported file types', () => {
    const file = new File(['dummy content'], 'test.xyz', { type: 'application/xyz' });
    const event = { target: { files: [file] } };
  
    component.onFileSelected(event as any);
  
    expect(component.filePreviewContent).toBe('No hay vista previa disponible para este tipo de archivo');
  });
  
});
