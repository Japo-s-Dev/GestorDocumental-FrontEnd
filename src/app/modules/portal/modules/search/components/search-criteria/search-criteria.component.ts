import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormConfigService } from '../../services/form-config.service';

@Component({
  selector: 'app-search-criteria',
  templateUrl: './search-criteria.component.html',
  styleUrls: ['./search-criteria.component.css']
})
export class SearchCriteriaComponent {
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [];
  selectedProject: number = 0;  // Propiedad para mantener el proyecto seleccionado

  constructor(private formService: FormConfigService) { }


  loadFormConfig(projectId: string) {
    this.formService.getFormConfig(projectId).subscribe(
      config => {
        this.fields = config;
      },
      error => {
        console.error('Error al cargar la configuración del formulario', error);
      }
    );
  }

  onProjectChange(newValue: number) {
    console.log("Project changed to:", newValue);
    this.loadFormConfig(newValue.toString());
  }

  onSubmit() {
    console.log("Selected Project ID:", this.selectedProject);
    console.log(this.model);

  }

  onSave() {
    console.log('Saving search...');
    // Implementa la lógica para guardar la búsqueda aquí
  }
}
