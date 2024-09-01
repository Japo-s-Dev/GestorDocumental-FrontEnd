import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css']
})
export class UploadDocumentComponent implements OnInit {
  selectedFile: File | null = null;
  fileUploaded = false;
  filePreviewUrl: string | null = null;  // Asegúrate de que sea de tipo string o null

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Asignar una URL de prueba al filePreviewUrl
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileUploaded = true;
  
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            this.filePreviewUrl = reader.result;
          } else {
            this.filePreviewUrl = null;
          }
        };
        reader.readAsDataURL(file);
      } else {
        this.filePreviewUrl = null;  // No preview available for non-PDF files
      }
    }
  }

  saveDocument(): void {
    if (this.selectedFile) {
      localStorage.setItem('uploadedFile', this.selectedFile.name);
      this.router.navigate(['/portal/add/file-entry']);
    }
  }
}
