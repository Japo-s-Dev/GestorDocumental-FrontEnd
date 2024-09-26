import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../../../../../enums/app.constants';
import { IIndexRequest } from '../../admin/modules/projects/interfaces/index.interface';
import { IExpedientRequest, IValueRequest } from '../interfaces/services.interface';


@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  constructor(private http: HttpClient) {}

  private createFormData(payload: any): FormData {
    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));
    return formData;
  }

  listProjects(): Observable<any> {
    const payload = { id: 1, method: 'list_projects', params: {} };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }

  listArchives(projectId: number): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_archives',
      params: {
        filters: {
          project_id: projectId
        }
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  // Crear expediente
  createArchive(data: IExpedientRequest): Observable<any> {
    const payload = {
      id: 1,
      method: 'create_archive',
      params: {
        data
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }


  // Obtener expediente por ID
  getArchiveById(expedientId: number): Observable<any> {
    const payload = {
      id: 1,
      method: 'get_archive',
      params: {
        id: expedientId
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  // Actualizar expediente
  updateArchive(expedientId: number, data: Partial<IExpedientRequest>): Observable<any> {
    const payload = {
      id: 1,
      method: 'update_archive',
      params: {
        id: expedientId,
        data
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }


  // Eliminar expediente
  deleteArchive(expedientId: number): Observable<any> {
    const payload = {
      id: 1,
      method: 'delete_archive',
      params: {
        id: expedientId
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  // Indices
  createIndex(data: IIndexRequest): Observable<any> {
    const payload = {
      id: 1,
      method: 'create_index',
      params: {
        data: { ...data, },
      },
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true,
    });
  }

  listIndices(projectId: number): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_indexes',
      params: {
        filters: { project_id: projectId },
      },
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true,
    });
  }

  updateIndex(indexId: number, data: IIndexRequest): Observable<any> {
    const payload = {
      id: 1,
      method: 'update_index',
      params: {
        id: indexId,
        data,
      },
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true,
    });
  }

  deleteIndex(indexId: number): Observable<any> {
    const payload = {
      id: 1,
      method: 'delete_index',
      params: { id: indexId },
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true,
    });
  }

  listDatatypes(): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_datatypes',
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true,
    });
  }

  createValue(data: IValueRequest): Observable<any> {
    const payload = {
      id: 1,
      method: 'create_value',
      params: {
        data
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


  // Método para obtener el árbol de archivos de un expediente
  getFileTree(expedientId: number): Observable<any> {
    const payload = {
      id: 1,
      method: 'get_file_tree',
      params: {
        id: expedientId
      }
    };
    const formData = this.createFormData(payload); // Usamos la función ya definida para crear el FormData
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }


  // Método para crear un separador (carpeta)
  createSeparator(name: string, parentId: number | null, archiveId: number): Observable<any> {
    const payload = {
      id: 1,
      method: 'create_separator',
      params: {
        data: {
          name: name,
          parent_id: parentId, // Puede ser null si no tiene padre
          archive_id: archiveId
        }
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  // Método para renombrar un separador (carpeta)
  updateSeparator(separatorId: number, newName: string): Observable<any> {
    const payload = {
      id: 1,
      method: 'update_separator',
      params: {
        id: separatorId,
        data: {
          name: newName
        }
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }



}
