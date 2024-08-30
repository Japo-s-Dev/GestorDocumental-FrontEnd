import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../../../../../../../enums/app.constants';

@Injectable({
  providedIn: 'root'
})
export class RolesCrudService {
  private apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  constructor(private http: HttpClient) {}

  listRoles(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const payload = { id: 1, method: 'list_roles' };
    return this.http.post<any>(this.apiUrl, payload, { headers, observe: 'response', withCredentials: true });
  }

  createRole(roleData: any): Observable<any> {
    const payload = { id: 1, method: 'create_role', params: { data: roleData } };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, payload, { headers, observe: 'response', withCredentials: true });
  }

  updateRole(roleId: number, roleData: any): Observable<any> {
    const payload = { id: 1, method: 'update_role', params: { id: roleId, data: roleData } };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, payload, { headers, observe: 'response', withCredentials: true });
  }

  deleteRole(roleId: number): Observable<any> {
    const payload = { id: 1, method: 'delete_role', params: { id: roleId } };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, payload, { headers, observe: 'response', withCredentials: true });
  }
}
