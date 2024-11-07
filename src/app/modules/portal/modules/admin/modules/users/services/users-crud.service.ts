import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../../../../../../../enums/app.constants';
import { CreateUserRequest } from '../interfaces/create-user.interface';
import { UpdateUserRequest } from '../interfaces/update-user.interface';
import { IDeleteUserRequest } from '../interfaces/delete-user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserCrudService {
  private apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  constructor(private http: HttpClient) {}

  private createFormData(payload: any): FormData {
    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));
    return formData;
  }

  listUsers(limit: number = 10, offset: number = 0, orderBys: string = '!id'): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_users',
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

  createUser(userData: CreateUserRequest): Observable<any> {
    const payload = {
      id: 1,
      method: 'create_user',
      params: { data: userData }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  updateUser(userId: number, userData: UpdateUserRequest): Observable<any> {
    const payload = {
      id: 1,
      method: 'update_user',
      params: {
        id: userId,
        data: userData
      }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }

  deleteUser(userId: number): Observable<any> {
    const payload: IDeleteUserRequest = {
      id: 1,
      method: 'delete_user',
      params: { id: userId }
    };
    const formData = this.createFormData(payload);
    return this.http.post<any>(this.apiUrl, formData, {
      observe: 'response',
      withCredentials: true
    });
  }
}
