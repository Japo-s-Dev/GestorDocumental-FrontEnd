import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../../../../../../../enums/app.constants';

@Injectable({
  providedIn: 'root',
})
export class ProjectsCrudService {
  private apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  constructor(private http: HttpClient) {}

  private createFormData(payload: any): FormData {
    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));
    return formData;
  }

  listProjects(limit: number = 10, offset: number = 0, orderBys: string = '!id'): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_structures',
      params: {
        list_options: {
          order_bys: orderBys,
          limit: limit,
          offset: offset
        }
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }

  createProject(projectData: any): Observable<any> {
    const payload = { id: 1, method: 'create_structure', params: { data: projectData } };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }

  updateProject(projectId: number, projectData: any): Observable<any> {
    const payload = { id: 1, method: 'update_structure', params: { id: projectId, data: projectData } };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }

  deleteProject(projectId: number): Observable<any> {
    const payload = { id: 1, method: 'delete_structure', params: { id: projectId } };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }

  getProjectById(projectId: number): Observable<any> {
    const payload = { id: 1, method: 'get_structure', params: { id: projectId } };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }
}
