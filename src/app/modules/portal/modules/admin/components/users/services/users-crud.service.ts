import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserCrudService {

    private apiUrl = `http://127.0.0.1:8080/api/rpc`;

  constructor(
    private http: HttpClient,
  ) {}

  private getHeaders() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      //'Cookie': `auth-token=${token}` // Agrega la cookie con el token
    });
    return { headers };
  }

  listUsers(): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_users'
    };
    return this.http.post<any>(this.apiUrl, payload, {
      ...this.getHeaders(),
      withCredentials: true
    });
  }
}
