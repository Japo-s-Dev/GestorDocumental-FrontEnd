import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IndexService } from '../../services/index.service';
import { IIndexRequest } from '../../interfaces/index.interface';
import { TranslateService } from '@ngx-translate/core';
import { IStructure } from '../../interfaces/structure.interface';
import { StructuresCrudService } from '../../services/structures-crud.service';

@Component({
  selector: 'app-structures-modal',
  templateUrl: './structures-modal.component.html',
  styleUrls: ['./structures-modal.component.css'],
})
export class StructuresModalComponent implements OnInit {
  @Input() isEditMode = false;
  @Input() structureData: IStructure | null = null;

  structureForm!: FormGroup;
  indexForm!: FormGroup;
  showWarningAlert = false;
  alertMessage = '';
  showIndexWarningAlert = false;
  indexAlertMessage = '';
  existingStructures: IStructure[] = [];
  indices: any[] = [];
  dataTypes: any[] = [];
  showIndexForm = false;
  isEditing = false;
  editingIndexId: number | null = null;
  structureCreated = false;
  tempStructureId: number | null = null;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private structuresCrudService: StructuresCrudService,
    private indexService: IndexService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initStructureForm();
    this.initIndexForm();
    this.loadStructures();
    this.loadDataTypes();

    if (this.isEditMode && this.structureData) {
      this.loadIndices();
      this.structureCreated = true;
    }
  }

  initStructureForm() {
    this.structureForm = this.fb.group({
      structure_name: [
        this.structureData?.structure_name || '',
        [Validators.required, Validators.maxLength(20), this.structureNameExistsValidator.bind(this)],
      ],
    });
  }

  initIndexForm() {
    this.indexForm = this.fb.group({
      index_name: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9 ]*$'), // Solo permite letras, números y espacios
          this.indexNameExistsValidator.bind(this)
        ]
      ],
      datatype_id: ['', Validators.required],
      required: [false],
    });
  }

  loadStructures() {
    this.structuresCrudService.listStructures().subscribe(
      (response) => {
        if (response && response.body.result) {
          this.existingStructures = response.body.result;
        }
      },
      (error) => {
        this.translate.get('projects:error_loading').subscribe((translatedText: string) => {
          this.showAlert(translatedText);
        });
      }
    );
  }

  loadIndices() {
    if (this.structureData) {
      this.indexService.listIndices(this.structureData.id).subscribe((response) => {
        if (response && response.body.result) {
          this.indices = response.body.result;
        }
      });
    }
  }

  loadDataTypes() {
    this.indexService.listDatatypes().subscribe(
      (response) => {
        if (response && response.body.result) {
          this.dataTypes = response.body.result;
        }
      },
      (error) => {
        this.translate.get('projects:error_loading_data_types').subscribe((translatedText: string) => {
          this.showAlert(translatedText);
        });
      }
    );
  }

  save() {
    this.structureForm.markAllAsTouched();
    if (this.structureForm.valid) {
      const formValue = this.structureForm.value;

      if (this.isEditMode && this.structureData) {
        this.structuresCrudService.updateStructure(this.structureData.id, formValue).subscribe(
          () => {
            this.translate.get('projects:project_updated_success').subscribe((translatedText: string) => {
              this.showAlert(translatedText);
            });
            this.activeModal.close('updated');
          },
          (error) => {this.translate.get('projects:error_updating_project').subscribe((translatedText: string) => {
          this.showAlert(translatedText);
        });}
        );
      } else if (!this.structureCreated) {
        // Crear proyecto si aún no ha sido creado
        this.structuresCrudService.createStructure(formValue).subscribe(
          (response) => {
            if (response.body.result) {
              this.structureData = response.body.result;
              if (this.structureData) {
                this.tempStructureId = this.structureData.id;
                this.structureCreated = true;
                this.translate.get('projects:project_created_success').subscribe((translatedText: string) => {
                  this.showAlert(translatedText);
                });
              }
            }
            this.loadIndices();
          },
          (error) => {
            this.translate.get('projects:error_creating_project').subscribe((translatedText: string) => {
              this.showAlert(translatedText);
            });
          }
        );
      } else {
        if (this.indices.length < 1) {
          this.translate.get('projects:add_at_least_one_index').subscribe((translatedText: string) => {
            this.showAlert(translatedText);
          });
          return;
        }
        this.activeModal.close('created');
      }
    } else {
      this.translate.get('projects:alert_complete_form').subscribe((translatedText: string) => {
        this.showAlert(translatedText);
      });
    }
  }

  onSubmitIndex() {
    if (this.indexForm.valid) {
      const indexData: IIndexRequest = {
        required: this.indexForm.value.required,
        structure_id: Number(this.structureData!.id),
        datatype_id: Number(this.indexForm.value.datatype_id),
        index_name: this.indexForm.value.index_name,
      };

      if (this.isEditing && this.editingIndexId) {
        // Actualizar índice existente
        this.indexService.updateIndex(this.editingIndexId, indexData).subscribe(
          () => {
            this.loadIndices();  // Recargar los índices
            this.cancelEdit();    // Cerrar el formulario y volver al listado
          },
          (error) => {
            this.translate.get('projects:error_updating_index').subscribe((translatedText: string) => {
              this.showAlert(translatedText);
            });
          }
        );
      } else {
        // Crear nuevo índice
        this.indexService.createIndex(indexData).subscribe(
          () => {
            this.loadIndices();  // Recargar los índices
            this.cancelEdit();    // Cerrar el formulario y volver al listado
          },
          (error) => {
            this.translate.get('projects:error_creating_index').subscribe((translatedText: string) => {
              this.showAlert(translatedText);
            });
          }
        );
      }
    } else {
      this.showIndexAlert('Nombre del índice solo puede contener letras o números.');
    }
  }


  editIndex(index: any) {
    this.isEditing = true;
    this.editingIndexId = index.id;
    this.showIndexForm = true;
    this.indexForm.patchValue(index);
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingIndexId = null;
    this.showIndexForm = false;
    this.indexForm.reset();
  }

  deleteIndex(indexId: number) {
    this.indexService.deleteIndex(indexId).subscribe(
      () => {
        this.loadIndices();
      },
      (error) => {this.translate.get('projects:error_deleting_index').subscribe((translatedText: string) => {
        this.showAlert(translatedText);
      }); }
    );
  }

  close() {
    if (!this.isEditMode && this.structureCreated && this.indices.length < 1 && this.tempStructureId) {
      this.structuresCrudService.deleteStructure(this.tempStructureId).subscribe(() => {
        this.activeModal.dismiss();
      });
    } else {
      this.activeModal.dismiss();
    }
  }

  showAlert(message: string): void {
    this.alertMessage = message;
    this.showWarningAlert = true;

    setTimeout(() => {
      this.closeAlert();
    }, 10000);
  }

  showIndexAlert(message: string): void {
    this.indexAlertMessage = message;
    this.showIndexWarningAlert = true;

    setTimeout(() => {
      this.closeIndexAlert();
    }, 10000);
  }

  closeAlert(): void {
    this.showWarningAlert = false;
  }

  closeIndexAlert(): void {
    this.showIndexWarningAlert = false;
  }

  private structureNameExistsValidator(control: FormControl) {
    if (this.existingStructures.some((structure) => structure.structure_name === control.value && this.structureData?.structure_name !== control.value)) {
      return { structureNameExists: true };
    }
    return null;
  }

  private indexNameExistsValidator(control: FormControl) {
    if (
      this.indices.some(
        (index) =>
          index.index_name.toLowerCase() === control.value.toLowerCase() &&
          (!this.isEditing || index.id !== this.editingIndexId)
      )
    ) {
      return { indexNameExists: true };
    }
    return null;
  }

  toggleIndexForm() {
    this.showIndexForm = !this.showIndexForm;
  }

  getTypeName(datatypeId: number) {
    const type = this.dataTypes.find((dt) => dt.id === datatypeId);
    return type ? type.datatype_name : this.translate.instant('projects:unknown');
  }
}
