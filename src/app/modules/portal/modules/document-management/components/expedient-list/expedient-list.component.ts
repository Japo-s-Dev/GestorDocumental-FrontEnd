import { Component, OnInit } from '@angular/core';
import { IExpedient, IIndex, IProject, IValue } from '../../interfaces/services.interface';
import { LoaderService } from '../../../../../../services/loader.service';
import { ServicesService } from '../../services/services.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpedientModalComponent } from '../expedient-modal/expedient-modal.component';
import { ConfirmModalComponent } from '../../../../../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-expedient-list',
  templateUrl: './expedient-list.component.html',
  styleUrls: ['./expedient-list.component.css']
})
export class ExpedientListComponent implements OnInit {

  // Alert properties
  alertVisible: boolean = false;
  alertTitle: string = '';
  alertMessage: string = '';
  alertType: string = 'alert-info';
  alertIcon: string = 'icon-info';

  projects: IProject[] = [];
  selectedProject: number = 0;
  expedients: IExpedient[] = [];
  indices: IIndex[] = [];
  values: IValue[] = [];
  tableHeaders: string[] = [];
  tableData: { [key: string]: any }[] = [];
  filteredData: { [key: string]: any }[] = [];

  constructor(
    private loaderService: LoaderService,
    private service: ServicesService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadProjects();

    // Recuperar el proyecto seleccionado del localStorage si existe
    const storedProjectId = localStorage.getItem('selectedProject');
    if (storedProjectId) {
      this.selectedProject = Number(storedProjectId);
      this.buildTable(); // Construir la tabla si hay un proyecto seleccionado
    }
  }

  buildTable(): void {
    this.loaderService.showLoader();
    this.fetchIndices(this.selectedProject);
    this.fetchExpedients(this.selectedProject);
  }

  reloadTableBasedOnIndices(): void {
    // Determinar la cantidad de recargas en base a la cantidad de índices
    const reloadCount = Math.floor(this.indices.length / 4) || 1;

    for (let i = 0; i < reloadCount; i++) {
      this.buildTable();
    }
  }

  loadProjects(): void {
    this.service.listProjects().subscribe(
      (response) => {
        if (response && response.body.result) {
          this.projects = response.body.result.map((project: any) => ({
            id: Number(project.id),
            name: project.project_name,
          })) as IProject[];
          console.log('Proyectos cargados:', this.projects);
        }
      },
      (error) => {
        console.error('Error al cargar proyectos:', error);
      }
    );
  }

  onProjectChange(projectId: number): void {
    this.selectedProject = projectId;
    // Almacenar el proyecto seleccionado en localStorage
    localStorage.setItem('selectedProject', projectId.toString());
    this.buildTable(); // Construir la tabla al cambiar de proyecto
  }

  fetchIndices(projectId: number): void {
    this.service.listIndices(Number(projectId)).subscribe((response) => {
      if (response && response.body.result) {
        this.indices = response.body.result as IIndex[];
        this.tableHeaders = ['id', ...this.indices.map((index) => index.index_name)];
        this.loaderService.hideLoader(); // Ocultar loader cuando termine de cargar los índices
      }
    });
  }

  fetchExpedients(projectId: number): void {
    // Limpiar los datos existentes
    this.expedients = [];
    this.values = [];
    this.tableData = [];

    this.service.listArchives(Number(projectId)).subscribe((response) => {
      if (response && response.body.result && response.body.result.length > 0) {
        this.expedients = response.body.result as IExpedient[];
        this.fetchValues();
      } else {
        this.expedients = [];
        this.filteredData = [];
        this.loaderService.hideLoader(); // Ocultar loader si no hay expedientes
      }
    });
  }

  fetchValues(): void {
    if (!this.expedients.length || !this.indices.length) {
      this.loaderService.hideLoader();
      return;
    }

    this.service.listValues().subscribe((response) => {
      if (response && response.body.result) {
        this.values = response.body.result as IValue[];
        this.buildTableData();
        setTimeout(() => {
          this.loaderService.hideLoader();
        }, 1500);
      }
    });
  }

  buildTableData(): void {
    this.tableData = this.expedients.map((expedient) => {
      const row: { [key: string]: any } = { id: expedient.id };

      this.indices.forEach((index) => {
        const value = this.values.find(
          (val) => val.index_id === index.id && val.archive_id === expedient.id
        );
        row[index.index_name] = value ? value.value : '';
      });

      return row;
    });

    this.filteredData = [...this.tableData];
  }

  openExpedientModal(): void {
    const modalRef = this.modalService.open(ExpedientModalComponent);
    modalRef.componentInstance.indices = this.indices;
    modalRef.componentInstance.projectId = this.selectedProject;

    modalRef.result.then((newExpedient) => {
      if (newExpedient) {
        this.reloadTableBasedOnIndices(); // Recargar la tabla según los índices
        this.showAlert('Creación', 'Expediente creado con éxito.', 'success');
      }
    }).catch((error) => {
      console.log('Modal dismissed', error);
    });
  }

  editExpedient(expedientId: number): void {
    const modalRef = this.modalService.open(ExpedientModalComponent);
    modalRef.componentInstance.isEditMode = true;
    modalRef.componentInstance.expedientId = expedientId;
    modalRef.componentInstance.indices = this.indices;
    modalRef.componentInstance.projectId = this.selectedProject;

    modalRef.result.then((result) => {
      if (result === 'updated') {
        this.reloadTableBasedOnIndices(); // Recargar la tabla según los índices
        this.showAlert('Actualización', 'Expediente actualizado con éxito.', 'success');
      }
    }).catch((error) => {
      console.log('Modal dismissed', error);
    });
  }

  deleteExpedient(expedientId: number): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = `¿Está seguro de querer eliminar el expediente con ID "${expedientId}"?`;

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.loaderService.showLoader();
        this.service.deleteArchive(expedientId).subscribe(
          () => {
            this.reloadTableBasedOnIndices(); // Recargar la tabla según los índices
            this.showAlert('Eliminación', 'Expediente eliminado con éxito.', 'info');
          },
          (error) => {
            console.error('Error al eliminar el expediente:', error);
            this.showAlert('Error', 'Error al eliminar el expediente.', 'danger');
            this.loaderService.hideLoader();
          }
        );
      }
    }).catch((error) => {
      console.log('Modal dismissed', error);
    });
  }

  showAlert(title: string, message: string, type: 'success' | 'warning' | 'danger' | 'info'): void {
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertType = `alert-${type}`;
    this.alertIcon = `fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'times-circle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'}`;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
    }, 7000);
  }

  handleAlertClosed(): void {
    this.alertVisible = false;
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredData = this.tableData.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm)
      )
    );
  }

  nextStep(): void {
    this.router.navigate(['/portal/document-management/viewer']);
  }
}
