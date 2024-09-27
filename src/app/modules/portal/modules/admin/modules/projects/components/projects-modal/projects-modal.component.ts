import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IProject } from '../../interfaces/project.interface';
import { ProjectsCrudService } from '../../services/projects-crud.service';
import { IndexService } from '../../services/index.service';
import { IIndexRequest } from '../../interfaces/index.interface';
import { TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'app-projects-modal',
  templateUrl: './projects-modal.component.html',
  styleUrls: ['./projects-modal.component.css'],
})
export class ProjectsModalComponent implements OnInit {
  @Input() isEditMode = false;
  @Input() projectData: IProject | null = null;

  projectForm!: FormGroup;
  indexForm!: FormGroup;
  showWarningAlert = false;
  alertMessage = '';
  showIndexWarningAlert = false;
  indexAlertMessage = '';
  existingProjects: IProject[] = [];
  indices: any[] = [];
  dataTypes: any[] = [];
  showIndexForm = false;
  isEditing = false;
  editingIndexId: number | null = null;
  projectCreated = false;
  tempProjectId: number | null = null;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private projectsCrudService: ProjectsCrudService,
    private indexService: IndexService,
    public translate: TranslateService 
  ) {}

  ngOnInit(): void {
    this.initProjectForm();
    this.initIndexForm();
    this.loadProjects();
    this.loadDataTypes();

    if (this.isEditMode && this.projectData) {
      this.loadIndices();
      this.projectCreated = true;
    }
  }

  initProjectForm() {
    this.projectForm = this.fb.group({
      project_name: [
        this.projectData?.project_name || '',
        [Validators.required, Validators.maxLength(20), this.projectNameExistsValidator.bind(this)],
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

  loadProjects() {
    this.projectsCrudService.listProjects().subscribe(
      (response) => {
        if (response && response.body.result) {
          this.existingProjects = response.body.result;
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
    if (this.projectData) {
      this.indexService.listIndices(this.projectData.id).subscribe((response) => {
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
    this.projectForm.markAllAsTouched();
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;

      if (this.isEditMode && this.projectData) {
        this.projectsCrudService.updateProject(this.projectData.id, formValue).subscribe(
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
      } else if (!this.projectCreated) {
        // Crear proyecto si aún no ha sido creado
        this.projectsCrudService.createProject(formValue).subscribe(
          (response) => {
            if (response.body.result) {
              this.projectData = response.body.result;
              if (this.projectData) {
                this.tempProjectId = this.projectData.id;
                this.projectCreated = true;
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
        project_id: Number(this.projectData!.id),
        datatype_id: Number(this.indexForm.value.datatype_id),
        index_name: this.indexForm.value.index_name,
      };

      if (this.isEditing && this.editingIndexId) {
        this.indexService.updateIndex(this.editingIndexId, indexData).subscribe(
          () => {
            this.loadIndices();
            this.cancelEdit();
          },
          (error) => {this.translate.get('projects:error_updating_index').subscribe((translatedText: string) => {
            this.showAlert(translatedText);
          }); }
        );
      } else {
        this.indexService.createIndex(indexData).subscribe(
          () => {
            this.loadIndices();
            this.indexForm.reset(); // Resetea el formulario para agregar un nuevo índice
            this.indexForm.patchValue({ required: false }); // Mantén el valor 'required' en falso por defecto
          },
          (error) => {this.translate.get('projects:error_creating_index').subscribe((translatedText: string) => {
            this.showAlert(translatedText);
          }); }
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
    if (!this.isEditMode && this.projectCreated && this.indices.length < 1 && this.tempProjectId) {
      this.projectsCrudService.deleteProject(this.tempProjectId).subscribe(() => {
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

  private projectNameExistsValidator(control: FormControl) {
    if (this.existingProjects.some((project) => project.project_name === control.value && this.projectData?.project_name !== control.value)) {
      return { projectNameExists: true };
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
