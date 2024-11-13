import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../../../../../../../enums/app.constants';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  constructor(private http: HttpClient) {}

  listEvents(filters: any = {}): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_events',
      params: {
        filters: filters,
        list_options: {
          order_bys: 'user_id',
        },
      },
    };
  
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true,
    });
  }

  private createFormData(payload: any): FormData {
    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));
    return formData;
  }
}
