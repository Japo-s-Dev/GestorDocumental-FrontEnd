import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  constructor(
    private http: HttpClient,
  ) {}

  listUsers(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const payload = {
      id: 1,
      method: 'list_users'
    };

    return this.http.post<any>(this.apiUrl, payload, {
      headers,
      observe: 'response',
      withCredentials: true
    });
  }

  createUser(userData: CreateUserRequest): Observable<any> {
    const payload = {
      id: 1,
      method: 'create_user',
      params: { data: userData }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, payload, {
      headers,
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

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, payload, {
      headers,
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

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, payload, {
      headers,
      observe: 'response',
      withCredentials: true
    });
  }

}
