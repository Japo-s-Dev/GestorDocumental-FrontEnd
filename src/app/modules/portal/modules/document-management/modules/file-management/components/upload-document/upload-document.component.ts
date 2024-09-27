import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ServicesService } from '../../../../services/services.service';  // Importar el servicio
import * as XLSX from 'xlsx'; // Para archivos Excel
import * as mammoth from 'mammoth'; // Para archivos Word
import { Location } from '@angular/common';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css'],
})
export class UploadDocumentComponent implements OnInit, OnDestroy {
  selectedFile: File | null = null;
  fileUploaded = false;
  filePreviewUrl: SafeResourceUrl | null = null;
  filePreviewContent: string | null = null;

  alertVisible = false;
  alertTitle = '';
  alertMessage = '';
  alertType = 'alert-info';
  alertIcon = 'icon-info';

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private service: ServicesService,
    private location: Location
  ) {}

  ngOnInit(): void {}

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

      const reader = new FileReader();

      // Manejar PDFs
      if (file.type === 'application/pdf') {
        this.filePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
      }
      // Manejar archivos Excel
      else if (file.type.includes('sheet') || file.type.includes('excel')) {
        reader.onload = (e: any) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonContent = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          this.filePreviewContent = JSON.stringify(jsonContent.slice(0, 5)); // Mostrar solo las primeras 5 filas como vista previa
        };
        reader.readAsArrayBuffer(file);
      }
      // Manejar archivos Word
      else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        reader.onload = (e: any) => {
          const arrayBuffer = e.target.result;
          mammoth.extractRawText({ arrayBuffer }).then((result) => {
            this.filePreviewContent = result.value.split('\n').slice(0, 5).join('\n');
          });
        };
        reader.readAsArrayBuffer(file);
      }
      // Manejar archivos de texto
      else if (file.type === 'text/plain') {
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            this.filePreviewContent = reader.result.split('\n').slice(0, 5).join('\n');
          } else {
            this.filePreviewContent = null;
          }
        };
        reader.readAsText(file);
      }
      // Manejar imágenes
      else if (file.type.startsWith('image/')) {
        this.filePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
      }
      // Otros tipos de archivo no compatibles
      else {
        this.filePreviewContent = 'No hay vista previa disponible para este tipo de archivo';
      }
    }
  }

  saveDocument(): void {
    if (this.selectedFile) {
      const separatorId = localStorage.getItem('selectedSeparatorId');

      if (!separatorId) {
        console.error('No se ha seleccionado un separador');
        return;
      }




      this.service.uploadDocument(this.selectedFile, Number(separatorId))
        .subscribe(
          response => {
            this.location.back();
          },
          error => {
            console.error('Error al subir el documento', error);
          }
        );
    }
  }

  handleAlertClosed(): void {
    this.alertVisible = false;
  }

  // Método para mostrar la alerta
  showAlert(title: string, message: string, type: 'success' | 'warning' | 'danger' | 'info'): void {
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertType = `alert-${type}`;
    this.alertIcon = `fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'times-circle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'}`;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
    }, 5000); // Ocultar la alerta después de 5 segundos
  }

  goBack(): void {
    this.location.back();
  }


}
