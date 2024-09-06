import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css'],
})
export class UploadDocumentComponent implements OnInit, OnDestroy {
  selectedFile: File | null = null;
  fileUploaded = false;
  filePreviewUrl: SafeResourceUrl | null = null;

  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  // Limpiar la URL creada al destruir el componente para evitar pérdidas de memoria
  ngOnDestroy(): void {
    if (this.filePreviewUrl && typeof this.filePreviewUrl === 'string') {
      URL.revokeObjectURL(this.filePreviewUrl);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileUploaded = true;

      // Verificar que el archivo sea un PDF

        // Crear una URL del archivo seleccionado y marcarla como segura
        const objectUrl = URL.createObjectURL(file);
        this.filePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
        console.log(this.filePreviewUrl);

    }
  }

  saveDocument(): void {
    if (this.selectedFile) {
      localStorage.setItem('uploadedFile', this.selectedFile.name);
      this.router.navigate(['/portal/add/file-entry']);
    }
  }
}
