import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../../../../../../../enums/app.constants';
import { IIndexRequest } from '../interfaces/index.interface';

@Injectable({
  providedIn: 'root',
})
export class IndexService {
  private apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  constructor(private http: HttpClient) {}

  private createFormData(payload: any): FormData {
    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));
    return formData;
  }

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
      params: {}
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true,
    });
  }

}
