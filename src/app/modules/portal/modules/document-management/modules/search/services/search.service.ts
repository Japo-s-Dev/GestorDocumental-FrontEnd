import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../../../../../../../enums/app.constants';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  constructor(private http: HttpClient) {}

  private createFormData(payload: any): FormData {
    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));
    return formData;
  }

  // En services.service.ts
  searchArchives(filters: any[]): Observable<any> {
  const payload = {
    id: 1,
    method: 'search_archives',
    params: {
      filters: filters
    }
  };

  const formData = this.createFormData(payload);
  return this.http.post<any>(this.apiUrl, formData, {
    observe: 'response',
    withCredentials: true
  });
}

}
