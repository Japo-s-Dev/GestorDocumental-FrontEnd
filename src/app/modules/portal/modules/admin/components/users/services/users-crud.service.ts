import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserCrudService {

    private apiUrl = `https://server.evoluciona.com.gt/api/rpc`;

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
}
