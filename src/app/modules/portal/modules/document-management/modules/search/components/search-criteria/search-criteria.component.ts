import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ServicesService } from '../../../../services/services.service';
import { IIndex, IProject } from '../../../../interfaces/services.interface';
import { LoaderService } from '../../../../../../../../services/loader.service';

@Component({
  selector: 'app-search-criteria',
  templateUrl: './search-criteria.component.html',
  styleUrls: ['./search-criteria.component.css']
})
export class SearchCriteriaComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  formFields: any[] = [];
  selectedProject: number = 0;
  projects: IProject[] = [];
  indices: IIndex[] = [];
  datatypes: any[] = [];

  constructor(
    private service: ServicesService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.loadProjects();
    this.loadDatatypes();
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
          this.loaderService.hideLoader();
        }
      },
      (error) => {
        this.loaderService.hideLoader();
        console.error('Error al cargar proyectos:', error);
      }
    );
  }

  loadDatatypes(): void {
    this.service.listDatatypes().subscribe(
      (response) => {
        if (response && response.body.result) {
          this.datatypes = response.body.result;
        }
      },
      (error) => {
        console.error('Error al cargar datatypes:', error);
      }
    );
  }

  onProjectChange(projectId: number): void {
    this.loaderService.showLoader();
    this.selectedProject = projectId;
    this.formFields = [];
    this.form = new FormGroup({});
    this.fetchIndices(projectId);
  }

  fetchIndices(projectId: number): void {
    this.service.listIndices(Number(projectId)).subscribe(
      (response) => {
        if (response && response.body.result) {
          this.indices = response.body.result as IIndex[];
          this.createFormControls(this.indices);
          this.loaderService.hideLoader();
        }
      },
      (error) => {
        this.loaderService.hideLoader();
        console.error('Error al cargar índices:', error);
      }
    );
  }

  createFormControls(indices: any[]): void {
    indices.forEach((index) => {
      const datatype = this.datatypes.find((dt) => dt.id === index.datatype_id);
      const fieldName = index.index_name.toLowerCase().replace(/\s+/g, '_');
      const control = new FormControl('');

      if (datatype) {
        switch (datatype.datatype_name.toLowerCase()) {
          case 'text':
          case 'number':
            this.form.addControl(fieldName, control);
            break;
          case 'date':
            this.form.addControl(fieldName + '_inicio', control);
            this.form.addControl(fieldName + '_fin', control);
            break;
          default:
            console.warn(`Tipo de dato no soportado: ${datatype.datatype_name}`);
            break;
        }
      }
    });
    this.formFields = indices;
  }


  getInputType(datatypeId: number): string {
    switch (datatypeId) {
      case 2:
        return 'number';
      case 3:
        return 'text';
      case 4:
        return 'number';
      case 5:
        return 'date';
      default:
        return 'text';
    }
  }

  onSubmit() {
    console.log('Form Submitted', this.form.value);
  }

  onReset() {
    this.form.reset();
  }
}
