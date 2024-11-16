import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileManagementService } from '../../services/file-management.service';

@Component({
  selector: 'app-rename-document-modal',
  templateUrl: './rename-document-modal.component.html',
  styleUrls: ['./rename-document-modal.component.css']
})
export class RenameDocumentModalComponent {
  @Input() documentId!: number;
  @Input() currentDocumentName!: string;
  renameForm: FormGroup;
  showWarningAlert = false;
  alertMessage = '';

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private fileManagementService: FileManagementService
  ) {
    this.renameForm = this.fb.group({
      document_name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.renameForm.patchValue({ document_name: this.currentDocumentName });
  }

  save(): void {
    if (this.renameForm.valid) {
      const newName = this.renameForm.get('document_name')?.value;
      this.fileManagementService.renameDocument(this.documentId, newName).subscribe(
        () => {
          this.activeModal.close(newName);
        },
        error => {
          console.error('Error renaming document:', error);
          this.showAlert('Hubo un problema al renombrar el documento. Intente de nuevo.');
        }
      );
    } else {
      this.showAlert('El nombre del documento es requerido.');
    }
  }

  showAlert(message: string): void {
    this.alertMessage = message;
    this.showWarningAlert = true;
  }

  close(): void {
    this.activeModal.dismiss();
  }

  closeAlert(): void {
    this.showWarningAlert = false;
  }
}



