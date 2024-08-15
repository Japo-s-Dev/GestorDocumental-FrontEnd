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
    this.filePreviewUrl = 'https://sergioale210.github.io/mis-archivo/CC3054.docx';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileUploaded = true;

      const reader = new FileReader();
      reader.onload = () => {
        // Asegúrate de que filePreviewUrl sea siempre una cadena
        if (typeof reader.result === 'string') {
          this.filePreviewUrl = reader.result;
        } else {
          this.filePreviewUrl = null;
        }
      };
      
      reader.readAsDataURL(file);
    }
  }

  saveDocument(): void {
    if (this.selectedFile) {
      localStorage.setItem('uploadedFile', this.selectedFile.name);
      this.router.navigate(['/portal/add/file-entry']);
    }
  }
}
