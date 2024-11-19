import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../../../../../../../enums/app.constants';

@Injectable({
  providedIn: 'root',
})
export class RolesCrudService {
  private apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  constructor(private http: HttpClient) {}

  private createFormData(payload: any): FormData {
    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));
    return formData;
  }

  listRoles(limit: number = 10, offset: number = 0, orderBys: string = '!id'): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_roles',
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

  getTotalRoles(): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_roles',
      params: {}  // Sin opciones de paginación para obtener todo
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }

  listPrivileges(): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_privileges',
      params: {}  // Sin opciones de paginación para obtener todo
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }

  createRole(roleData: any): Observable<any> {
    const payload = { id: 1, method: 'create_role', params: { data: roleData } };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }

  updateRole(roleId: number, roleData: any): Observable<any> {
    const payload = { id: 1, method: 'update_role', params: { id: roleId, data: roleData } };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }

  deleteRole(roleId: number): Observable<any> {
    const payload = { id: 1, method: 'delete_role', params: { id: roleId } };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }


  listRolePrivileges(roleName: string): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_associations_by_role',
      params: {
        data: {
          role_name: roleName
        }
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }

  enableRole(roleName: string, privilegeIds: number[]): Observable<any> {
    const payload = {
      id: 1,
      method: 'enable_associated_privilege',
      params: {
        data: {
          role_name: roleName,
          ids: privilegeIds
        }
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }

  disableRole(roleName: string, privilegeIds: number[]): Observable<any> {
    const payload = {
      id: 1,
      method: 'disable_associated_privilege',
      params: {
        data: {
          role_name: roleName,
          ids: privilegeIds
        }
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, { observe: 'response', withCredentials: true });
  }


}
