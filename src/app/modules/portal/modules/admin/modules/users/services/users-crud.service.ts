import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../../../../../../../enums/app.constants';
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
      withCredentials: true // Ensures cookies are sent
    });
  }

  createUser(data: { username: string, pwd_clear: string, email: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const payload = {
      id: 1,
      method: 'create_user',
      params: {
        data
      }
    };

    return this.http.post<any>(this.apiUrl, payload, {
      headers,
      withCredentials: true
    });
  }

  updateUser(userId: number, data: { username?: string, email?: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const payload = {
      id: 1,
      method: 'update_user',
      params: {
        id: userId,
        data
      }
    };

    return this.http.post<any>(this.apiUrl, payload, {
      headers,
      withCredentials: true
    });
  }



}
