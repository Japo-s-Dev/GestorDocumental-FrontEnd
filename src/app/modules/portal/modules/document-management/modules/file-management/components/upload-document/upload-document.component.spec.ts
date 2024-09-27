import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadDocumentComponent } from './upload-document.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
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

  it('should set filePreviewUrl for PDF files', (done) => {
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const event = { target: { files: [file] } };

    component.onFileSelected(event as any);

    const reader = new FileReader();
    reader.onload = () => {
      expect(component.filePreviewUrl).toBe(reader.result as string);
      done();  // Llama a done() para indicar que la prueba asíncrona ha terminado
    };
    reader.readAsDataURL(file);
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
});
