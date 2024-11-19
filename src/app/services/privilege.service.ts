import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../enums/app.constants';


@Injectable({
  providedIn: 'root',
})
export class PrivilegeService {
  private apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  constructor(private http: HttpClient) {}

  private createFormData(payload: any): FormData {
    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));
    return formData;
  }

  // Llama al backend para obtener los privilegios habilitados por rol
  fetchPrivileges(roleName: string): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_enabled_privileges',
      params: {
        data: {
          role_name: roleName,
        },
      },
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }

  // Almacena los privilegios en el localStorage
  setPrivileges(privileges: number[]): void {
    localStorage.setItem('privileges', JSON.stringify(privileges));
  }

  // Obtiene los privilegios desde el localStorage
  getPrivileges(): number[] {
    const privileges = localStorage.getItem('privileges');
    return privileges ? JSON.parse(privileges) : [];
  }

  // Borra los privilegios del localStorage
  clearPrivileges(): void {
    localStorage.removeItem('privileges');
  }
}
