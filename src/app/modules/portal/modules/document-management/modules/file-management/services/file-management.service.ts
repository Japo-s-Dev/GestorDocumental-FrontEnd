import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../../../../../../../enums/app.constants';

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {

  private apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  constructor(private http: HttpClient) {}

  private createFormData(payload: any): FormData {
    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));
    return formData;
  }

  /**
   * Método para obtener la URL de un documento por su ID
   * @param documentId El ID del documento
   * @returns Observable con la URL del documento
   */
  getDocumentUrl(documentId: number): Observable<any> {
    const payload = {
      id: 1,
      method: 'get_doc_url',
      params: {
        id: documentId
      }
    };

    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  createComment(archiveId: number, text: string): Observable<any> {
    const payload = {
      id: 1,
      method: 'create_comment',
      params: {
        data: {
          archive_id: archiveId,
          text: text
        }
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  getComment(commentId: number): Observable<any> {
    const payload = {
      id: 1,
      method: 'get_comment',
      params: {
        id: commentId
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  listComments(): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_comments',
      params: {}
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  listEvents(archiveId: number): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_events',
      params: {
        filters: {
          archive_id: archiveId
        },
        list_options: {
          order_bys: "timestamp"
        }
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

  // Método para eliminar un separador (carpeta)
  deleteSeparator(separatorId: number): Observable<any> {
    const payload = {
      id: 1,
      method: 'delete_separator',
      params: {
        id: separatorId
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  uploadDocument(file: File, separatorId: number, fileName: string): Observable<any> {
    const payload = {
      id: 1,
      method: 'create_document',
      params: {
        data: {
          separator_id: separatorId,
          name: fileName
        }
      }
    };

    const formData = this.createFormData(payload);
    formData.append('file', file);

    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  renameDocument(documentId: number, newName: string): Observable<any> {
    const payload = {
      id: 1,
      method: 'rename_document',
      params: {
        id: documentId,
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

