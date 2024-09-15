import { Component, OnInit } from '@angular/core';
import { IExpedient, IIndex, IProject, IValue } from '../../interfaces/services.interface';
import { LoaderService } from '../../../../../../services/loader.service';
import { ServicesService } from '../../services/services.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpedientModalComponent } from '../expedient-modal/expedient-modal.component';


@Component({
  selector: 'app-expedient-list',
  templateUrl: './expedient-list.component.html',
  styleUrls: ['./expedient-list.component.css']
})
export class ExpedientListComponent implements OnInit {
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
    this.loaderService.showLoader();
    this.loadProjects();
    setTimeout(() => {
      this.loaderService.hideLoader();
    }, 500);
  }

  loadProjects(): void {
    this.loaderService.showLoader();
    this.service.listProjects().subscribe(
      (response) => {
        if (response && response.body.result) {
          this.projects = response.body.result.map((project: any) => ({
            id: Number(project.id),
            name: project.project_name,
          })) as IProject[];

          console.log('Proyectos cargados:', this.projects);
        }
        this.loaderService.hideLoader();
      },
      (error) => {
        console.error('Error al cargar proyectos:', error);
        this.loaderService.hideLoader();
      }
    );
  }


  onProjectChange(projectId: number): void {
    this.loaderService.showLoader();
    this.selectedProject = projectId;
    console.log('Selected project:', projectId);
    this.fetchIndices(projectId);
    this.fetchExpedients(projectId);
    setTimeout(() => {
      this.loaderService.hideLoader();
    }, 1000);
  }

  fetchIndices(projectId: number): void {
    this.service.listIndices(Number(projectId)).subscribe((response) => {
      if (response && response.body.result) {
        this.indices = response.body.result as IIndex[];
        this.tableHeaders = this.indices.map((index) => index.index_name);
      }
    });
  }

  fetchExpedients(projectId: number): void {

    this.service.listArchives(Number(projectId)).subscribe((response) => {
      if (response && response.body.result) {
        this.expedients = response.body.result as IExpedient[];
        this.fetchValues();
      }
    });
  }

  fetchValues(): void {
    if (!this.expedients.length || !this.indices.length) return;

    this.service.listValues().subscribe((response) => {
      if (response && response.body.result) {
        this.values = response.body.result as IValue[];
        this.buildTableData();
      }
    });
  }

  buildTableData(): void {
    this.tableHeaders = ['id', ...this.indices.map((index) => index.index_name)];

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

    modalRef.result.then((newExpedient) => {
      if (newExpedient) {
        // Lógica para guardar el expediente y luego actualizar la tabla
        console.log('Expediente agregado:', newExpedient);
        // Aquí llamarías a un método para guardar el expediente en el backend y actualizar la tabla
      }
    }).catch((error) => {
      console.log('Modal dismissed', error);
    });
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
    // Navega a la ruta del visor de documentos
    this.router.navigate(['/portal/document-management/viewer']);
  }
}
