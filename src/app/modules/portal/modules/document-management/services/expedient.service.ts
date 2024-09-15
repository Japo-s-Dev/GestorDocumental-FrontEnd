import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../../../../../enums/app.constants';


@Injectable({
  providedIn: 'root'
})
export class ExpedientService {
  private apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  constructor(private http: HttpClient) {}

  private createFormData(payload: any): FormData {
    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));
    return formData;
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

  listProjects(): Observable<any> {
    const payload = { id: 1, method: 'list_projects', params: {} };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }
}
