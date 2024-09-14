import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IProject } from '../../interfaces/project.interface';
import { ProjectsCrudService } from '../../services/projects-crud.service';

@Component({
  selector: 'app-projects-modal',
  templateUrl: './projects-modal.component.html',
  styleUrls: ['./projects-modal.component.css'],
})
export class ProjectsModalComponent implements OnInit {
  @Input() isEditMode = false;
  @Input() projectData: IProject | null = null;

  projectForm!: FormGroup;
  showWarningAlert = false;
  alertMessage = '';
  existingProjects: IProject[] = [];

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private projectsCrudService: ProjectsCrudService,
  ) {}

  ngOnInit(): void {
    // Obtener todos los proyectos existentes para validar duplicados
    this.projectsCrudService.listProjects().subscribe(response => {
      if (response && response.body.result) {
        this.existingProjects = response.body.result;
      }
    });

    this.projectForm = this.fb.group({
      project_name: [
        this.projectData?.project_name || '',
        [Validators.required, Validators.maxLength(20), this.projectNameExistsValidator.bind(this)]
      ],
    });

    // Asegurarse de que la alerta no se muestre al iniciar
    this.showWarningAlert = false;
  }

  save() {
    // Marca los controles del formulario como tocados para activar las validaciones visuales
    this.projectForm.markAllAsTouched();

    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;

      if (this.isEditMode) {
        this.projectsCrudService.updateProject(this.projectData!.id, formValue).subscribe(
          () => {
            this.activeModal.close('updated');
          },
          (error) => {
            this.showAlert('Error al actualizar el proyecto');
            console.error('Error al actualizar el proyecto', error);
          },
        );
      } else {
        this.projectsCrudService.createProject(formValue).subscribe(
          () => {
            this.activeModal.close('created');
          },
          (error) => {
            this.showAlert('Error al crear el proyecto');
            console.error('Error al crear el proyecto', error);
          },
        );
      }
    } else {
      this.showAlert('Por favor, completa el formulario correctamente');
    }
  }

  close() {
    this.activeModal.dismiss();
  }

  showAlert(message: string): void {
    this.alertMessage = message;
    this.showWarningAlert = true;

    setTimeout(() => {
      this.closeAlert();
    }, 10000);
  }

  closeAlert(): void {
    this.showWarningAlert = false;
  }

  private projectNameExistsValidator(control: FormControl) {
    if (
      this.existingProjects.some(
        project => project.project_name === control.value && this.projectData?.project_name !== control.value
      )
    ) {
      return { projectNameExists: true };
    }
    return null;
  }
}
