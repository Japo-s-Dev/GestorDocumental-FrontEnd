import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent implements OnInit {
  selectedDocumentUrl: string | null = null;
  selectedDocumentName: string | null = null;
  activeTab: string = 'archivos'; // Default tab set to 'archivos'
  idExpediente: number | null = null;

  constructor(private location: Location) {}

  ngOnInit(): void {
    this.idExpediente = Number(localStorage.getItem('selectedExpedientId')) || null;
  }

  onFileSelected(file: { url: string, name: string }) {
    this.selectedDocumentUrl = file.url;
    this.selectedDocumentName = file.name;
  }

  goBack(): void {
    this.location.back();
  }
}
