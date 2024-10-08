import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-folder-modal',
  templateUrl: './folder-modal.component.html',
  styleUrls: ['./folder-modal.component.css']
})
export class FolderModalComponent {
  @Input() isEditMode = false;
  @Input() data: { folderName?: string } = {};
  folderForm: FormGroup;
  showWarningAlert = false;
  alertMessage = '';

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    this.folderForm = this.fb.group({
      folder_name: [this.data.folderName || '', Validators.required]
    });
  }

  save(): void {
    if (this.folderForm.valid) {
      const folderName = this.folderForm.get('folder_name')?.value;
      this.activeModal.close(folderName);
    } else {
      this.showAlert('El nombre de la carpeta es requerido.');
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
