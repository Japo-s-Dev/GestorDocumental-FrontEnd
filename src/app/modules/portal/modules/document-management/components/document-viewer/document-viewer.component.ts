import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent {
  selectedDocumentUrl: string | null = null;
  selectedDocumentName: string | null = null;
  activeTab: string = 'archivos'; // Default tab set to 'archivos'

  constructor(private location: Location) {}

  onFileSelected(file: { url: string, name: string }) {
    this.selectedDocumentUrl = file.url;
    this.selectedDocumentName = file.name;
  }

  goBack(): void {
    this.location.back();
  }
}
