import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ServicesService } from '../../../../services/services.service';
import { IIndex, IProject } from '../../../../interfaces/services.interface';
import { LoaderService } from '../../../../../../../../services/loader.service';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
  rangeActive: { [key: string]: boolean } = {};
  dateError: { [key: string]: boolean } = {};

  // Alert properties
  alertVisible: boolean = false;
  alertTitle: string = '';
  alertMessage: string = '';
  alertType: string = 'alert-info';
  alertIcon: string = 'icon-info';

  constructor(
    private service: ServicesService,
    private searchService: SearchService,
    private loaderService: LoaderService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    localStorage.removeItem('searchResults')
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
            this.form.addControl(fieldName, control);
            break;
          case 'number':
            this.rangeActive[fieldName] = false;
            this.form.addControl(fieldName, control);
            this.form.addControl(fieldName + '_inicio', new FormControl(''));
            this.form.addControl(fieldName + '_fin', new FormControl(''));
            break;
          case 'date':
            this.form.addControl(fieldName + '_inicio', new FormControl(''));
            this.form.addControl(fieldName + '_fin', new FormControl(''));
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

  toggleRange(fieldName: string) {
    const processedFieldName = this.replaceSpaces(fieldName.toLowerCase());

    this.rangeActive[fieldName] = !this.rangeActive[fieldName];

    if (this.rangeActive[fieldName]) {
      this.form.get(processedFieldName)?.reset();
    } else {
      this.form.get(processedFieldName + '_inicio')?.reset();
      this.form.get(processedFieldName + '_fin')?.reset();
    }

    this.form.updateValueAndValidity();
  }

  onSubmit() {
    this.loaderService.showLoader();
    localStorage.removeItem('searchResults');
    const formValues = this.form.value;
    const filters: any[] = [];

    this.indices.forEach((index) => {
      const fieldName = index.index_name.toLowerCase().replace(/\s+/g, '_');
      const datatype = this.datatypes.find((dt) => dt.id === index.datatype_id);

      if (datatype) {
        switch (datatype.datatype_name.toLowerCase()) {
          case 'number':
            if (this.rangeActive[index.index_name]) {
              const inicio = formValues[fieldName + '_inicio'];
              const fin = formValues[fieldName + '_fin'];
              if (inicio && fin) {
                filters.push({ index_id: index.id, value: inicio, operator: 'Gte', datatype_id: datatype.id });
                filters.push({ index_id: index.id, value: fin, operator: 'Lte', datatype_id: datatype.id });
              } else if (inicio) {
                filters.push({ index_id: index.id, value: inicio, operator: 'Eq', datatype_id: datatype.id });
              } else if (fin) {
                filters.push({ index_id: index.id, value: fin, operator: 'Eq', datatype_id: datatype.id });
              }
            } else {
              const value = formValues[fieldName];
              if (value) {
                filters.push({ index_id: index.id, value, operator: 'Eq', datatype_id: datatype.id });
              }
            }
            break;

          case 'date':
            const startDate = formValues[fieldName + '_inicio'];
            const endDate = formValues[fieldName + '_fin'];

            if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
              this.dateError[fieldName] = true;
            } else {
              this.dateError[fieldName] = false;
              if (startDate && endDate) {
                filters.push({ index_id: index.id, value: startDate, operator: 'Gte', datatype_id: datatype.id });
                filters.push({ index_id: index.id, value: endDate, operator: 'Lte', datatype_id: datatype.id });
              } else if (startDate && !endDate) {
                filters.push({ index_id: index.id, value: startDate, operator: 'Eq', datatype_id: datatype.id });
              }
            }
            break;

          case 'text':
            const fieldValue = formValues[fieldName];
            if (fieldValue && fieldValue.trim() !== '') {
              filters.push({ index_id: index.id, value: fieldValue.trim(), operator: 'Eq', datatype_id: datatype.id });
            }
            break;

          default:
            console.warn(`Tipo de dato no soportado para filtros: ${datatype.datatype_name}`);
            break;
        }
      }
    });

    if (filters.length > 0) {
      this.searchService.searchArchives(filters).subscribe(
        (response) => {
          const results = response.body.result;
          if (response.body.result.length === 0) {
            this.loaderService.hideLoader();
            const error = 'Error';
            this.translate.get('search_results:alert').subscribe((message: string) => {
              this.showAlert({ error, message }, 'danger');
            });
          } else {
            this.nextStep(results, this.selectedProject);
          }
        },
        (error) => {
          this.loaderService.hideLoader();
          console.error('Error al realizar la búsqueda:', error);
        }
      );
    } else {
      this.loaderService.hideLoader();
      console.log('No se encontraron filtros válidos para aplicar.');
    }
    this.loaderService.hideLoader();
  }


  replaceSpaces(indexName: string): string {
    return indexName.toLowerCase().replace(/\s+/g, '_');
  }

  nextStep(searchResults: any[], selectedProject: number): void {
    // Guardar los resultados de búsqueda y el proyecto seleccionado en localStorage
    localStorage.setItem('searchResults', JSON.stringify(searchResults));
    localStorage.setItem('selectedProject', selectedProject.toString());

    // Navegar al componente de resultados
    this.router.navigate(['/portal/document-management/search/result']);
  }



  onReset() {
    this.form.reset();
  }

  showAlert(translatedText: any, type: 'success' | 'warning' | 'danger' | 'info'): void {
    this.alertTitle = translatedText.title;
    this.alertMessage = translatedText.message;
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
