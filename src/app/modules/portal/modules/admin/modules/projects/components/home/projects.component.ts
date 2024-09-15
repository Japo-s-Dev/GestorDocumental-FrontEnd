import { Component, OnInit } from '@angular/core';
import { IProject } from '../../interfaces/project.interface';
import { ProjectsCrudService } from '../../services/projects-crud.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsModalComponent } from '../projects-modal/projects-modal.component';
import { ConfirmModalComponent } from '../../../../../../../../shared/confirm-modal/confirm-modal.component';
import { LoaderService } from '../../../../../../../../services/loader.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  projects: IProject[] = [];
  searchTerm: string = '';

  // Alert properties
  alertVisible: boolean = false;
  alertTitle: string = '';
  alertMessage: string = '';
  alertType: string = 'alert-info';
  alertIcon: string = 'icon-info';

  constructor(
    private projectsCrudService: ProjectsCrudService,
    private modalService: NgbModal,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.loaderService.showLoader();
    this.loadProjects();
    setTimeout(() => {
      this.loaderService.hideLoader();
    }, 2000);
  }

  loadProjects(): void {
    this.projectsCrudService.listProjects().subscribe(
      (response) => {
        if (response && response.body.result) {
          this.projects = response.body.result;
          console.log('Projects:', this.projects);
        }
      },
      (error) => {
        this.showAlert('Error', 'Error al obtener los proyectos.', 'danger');
        console.error('Error al obtener los proyectos:', error);
      },
    );
  }

  openProjectModal(project: IProject | null = null): void {
    const modalRef = this.modalService.open(ProjectsModalComponent);
    modalRef.componentInstance.projectData = project || {};
    modalRef.componentInstance.isEditMode = !!project;

    modalRef.result
      .then((result) => {
        if (result) {
          this.loadProjects();
          if (result === 'created') {
            this.loaderService.showLoader();
            this.showAlert('Agregación', 'Proyecto creado con éxito.', 'success');
            setTimeout(() => {
              this.loaderService.hideLoader();
            }, 1000);
          } else if (result === 'updated') {
            this.loaderService.showLoader();
            this.showAlert('Actualización', 'Proyecto actualizado con éxito.', 'warning');
            setTimeout(() => {
              this.loaderService.hideLoader();
            }, 1000);
          }
        }
      })
      .catch((error) => {
        console.log('Modal dismissed', error);
      });
  }

  addProject(): void {
    this.openProjectModal();
  }

  editProject(project: IProject): void {
    this.openProjectModal(project);
  }

  deleteProject(project: IProject): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = `¿Está seguro de querer eliminar el proyecto "${project.project_name}"?`;
    modalRef.result
      .then((result) => {
        if (result === 'confirm') {
          this.projectsCrudService.deleteProject(project.id).subscribe(
            () => {
              this.loaderService.showLoader();
              this.showAlert('Eliminación', 'Proyecto eliminado con éxito.', 'info');
              this.loadProjects();
              setTimeout(() => {
                this.loaderService.hideLoader();
              }, 1000);
            },
            (error) => {
              this.loaderService.showLoader();
              this.showAlert('Error', 'Error al eliminar el proyecto.', 'danger');
              console.error('Error al eliminar el proyecto:', error);
              setTimeout(() => {
                this.loaderService.hideLoader();
              }, 1000);
            },
          );
        }
      })
      .catch((error) => {
        console.log('Modal dismissed', error);
      });
  }

  filteredProjects(): IProject[] {
    if (!this.searchTerm) {
      return this.projects;
    }
    return this.projects.filter((project) =>
      project.project_name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  showAlert(title: string, message: string, type: 'success' | 'warning' | 'danger' | 'info'): void {
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertType = `alert-${type}`;
    this.alertIcon = `fa-${
      type === 'success' ? 'check-circle' : type === 'danger' ? 'times-circle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'
    }`;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
    }, 7000);
  }

  handleAlertClosed(): void {
    this.alertVisible = false;
  }
}
