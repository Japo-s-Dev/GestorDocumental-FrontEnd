import { Component } from '@angular/core';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent {
  selectedDocument: any;

  onFileSelected(file: any) {
    this.selectedDocument = file;
  }
}
