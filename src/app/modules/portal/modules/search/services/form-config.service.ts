// form-config.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable({
  providedIn: 'root'
})
export class FormConfigService {
  private baseUrl = 'assets/data'; // Ajusta la URL base donde se encuentran los archivos JSON

  constructor(private http: HttpClient) { }

  getFormConfig(projectId: string | undefined): Observable<any> {
    const effectiveProjectId = projectId ?? 'default';  // 'default' es un ID o nombre de archivo predeterminado
    return this.http.get<any[]>(`${this.baseUrl}/${effectiveProjectId}.json`).pipe(
      map(data => data.map(item => this.toFormlyFieldConfig(item)))
    );
}

  private toFormlyFieldConfig(item: any): FormlyFieldConfig {
    return {
      key: item.nombre.toLowerCase(),
      type: item.tipo === 'date' ? 'input' : item.tipo,
      className: 'attributeForm',
      templateOptions: {
        type: item.tipo,
        label: item.nombre,
        placeholder: `Ingrese ${item.nombre}`,
        required: false,
        className: 'custom-input-class'
      }
    };
  }

}


