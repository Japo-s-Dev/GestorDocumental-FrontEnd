import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../../../../../enums/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ValueService {
  private apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  constructor(private http: HttpClient) {}

  // Método para crear un valor
  createValue(indexId: number, projectId: number, expedientId: number, value: string): Observable<any> {
    const payload = {
      id: 1,
      method: 'create_value',
      params: {
        data: {
          index_id: indexId,
          project_id: projectId,
          archive_id: expedientId,
          value: value
        }
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  // Método para obtener un valor por ID
  getValueById(valueId: number): Observable<any> {
    const payload = {
      id: 1,
      method: 'get_value',
      params: {
        id: valueId
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  // Método para actualizar un valor
  updateValue(valueId: number, newValue: string): Observable<any> {
    const payload = {
      id: 1,
      method: 'update_value',
      params: {
        id: valueId,
        data: {
          value: newValue
        }
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  // Método para listar todos los valores
  listValues(): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_values',
      params: {}
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  // Método para eliminar un valor
  deleteValue(valueId: number): Observable<any> {
    const payload = {
      id: 1,
      method: 'delete_value',
      params: {
        id: valueId
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  // Método privado para crear FormData con el payload
  private createFormData(payload: any): FormData {
    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));
    return formData;
  }
}
