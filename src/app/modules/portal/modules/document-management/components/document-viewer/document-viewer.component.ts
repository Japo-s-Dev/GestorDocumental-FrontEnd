import { Component } from '@angular/core';
import { Location } from '@angular/common'; // Importa Location para manejar la navegación

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent {
  selectedDocumentUrl: string | null = null;
  selectedDocumentName: string | null = null;

  constructor(private location: Location) {} // Inyecta Location

  onFileSelected(file: { url: string, name: string }) {
    this.selectedDocumentUrl = file.url;
    this.selectedDocumentName = file.name;
  }

  goBack(): void {
    this.location.back(); // Navega a la ruta anterior
  }
}
