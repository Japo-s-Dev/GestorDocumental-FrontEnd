import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RenameDocumentModalComponent } from '../rename-document-modal/rename-document-modal.component';
import { LoaderService } from '../../../../../../../../services/loader.service';
import { FileTreeComponent } from '../file-tree/file-tree.component'; // Importar FileTreeComponent

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent implements OnInit {
  @ViewChild(FileTreeComponent) fileTreeComponent!: FileTreeComponent; // Referencia al componente FileTree

  selectedDocumentUrl: string | null = null;
  selectedDocumentName: string | null = null;
  selectedDocumentId: number | null = null;
  activeTab: string = 'archivos'; // Default tab set to 'archivos'
  idExpediente: number | null = null;

  constructor(
    private location: Location,
    private router: Router,
    private modalService: NgbModal,
    private loaderService: LoaderService // Servicio de loader
  ) {}

  ngOnInit(): void {
    this.idExpediente = Number(localStorage.getItem('selectedExpedientId')) || null;
    localStorage.removeItem('selectedDocumentId');
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

  onFileSelected(file: { url: string, name: string, fileId: number }) {
    this.selectedDocumentUrl = file.url;
    this.selectedDocumentName = file.name;
    this.selectedDocumentId = file.fileId;
  }

  openRenameModal(): void {
    if (this.selectedDocumentId && this.selectedDocumentName) {
      const modalRef = this.modalService.open(RenameDocumentModalComponent);
      modalRef.componentInstance.documentId = this.selectedDocumentId;
      modalRef.componentInstance.currentDocumentName = this.selectedDocumentName;

      modalRef.result.then((newName: string) => {
        if (newName) {
          this.loaderService.showLoader(); // Mostrar el loader
          this.selectedDocumentName = newName;

          // Llamar al método para refrescar el árbol de archivos
          this.fileTreeComponent.loadFileTree(this.idExpediente!);

          // Ocultar el loader después de un pequeño retraso para la simulación de carga
          setTimeout(() => {
            this.loaderService.hideLoader();
          }, 1000);
        }
      }).catch(error => {
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/portal/document-management/expedient-list']);
  }
}
