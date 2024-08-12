import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../interfaces/login-request.interface';
import { AppConstants } from '../enums/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = `${AppConstants.BASE_URL}/api/login`;

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<any> {
    // Definir los encabezados
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Realizar la solicitud POST con los encabezados
    return this.http.post<any>(this.loginUrl, loginRequest, { headers });
  }
}
