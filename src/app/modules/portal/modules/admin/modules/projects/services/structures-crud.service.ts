import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../../../../../../../enums/app.constants';

@Injectable({
  providedIn: 'root',
})
export class StructuresCrudService {
  private apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  constructor(private http: HttpClient) {}

  private createFormData(payload: any): FormData {
    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));
    return formData;
  }

  listStructures(): Observable<any> {
    const payload = { id: 1, method: 'list_structures', params: {} };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }

  createStructure(structureData: any): Observable<any> {
    const payload = { id: 1, method: 'create_structure', params: { data: structureData } };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }

  updateStructure(structureId: number, structureData: any): Observable<any> {
    const payload = { id: 1, method: 'update_structure', params: { id: structureId, data: structureData } };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }

  deleteStructure(structureId: number): Observable<any> {
    const payload = { id: 1, method: 'delete_structure', params: { id: structureId } };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }

  getStructureById(structureId: number): Observable<any> {
    const payload = { id: 1, method: 'get_structure', params: { id: structureId } };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }
}
