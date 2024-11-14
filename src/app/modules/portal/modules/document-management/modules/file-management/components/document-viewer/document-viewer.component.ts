import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.idExpediente = Number(localStorage.getItem('selectedExpedientId')) || null;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;

    // Eliminar selectedDocumentId y resetear valores si se selecciona la pestaña 'archivos'
    if (tab === 'archivos') {
      localStorage.removeItem('selectedDocumentId');
      this.selectedDocumentUrl = null;
      this.selectedDocumentName = null;
    }
  }

  onFileSelected(file: { url: string, name: string }) {
    this.selectedDocumentUrl = file.url;
    this.selectedDocumentName = file.name;
  }

  goBack(): void {
    this.router.navigate(['/portal/document-management/expedient-list']);
  }
}
