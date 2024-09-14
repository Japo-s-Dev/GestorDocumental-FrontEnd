import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, LogOffRequest } from '../interfaces/login-request.interface';
import { AppConstants } from '../enums/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = `${AppConstants.BASE_URL}/api/login`;
  private logoutUrl = `${AppConstants.BASE_URL}/api/logoff`;

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.loginUrl, loginRequest, { headers, observe: 'response', withCredentials: true })
      .pipe(
        tap((response) => {
        })
      );
  }

  logoff(logOffRequest: LogOffRequest): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.logoutUrl, logOffRequest, { observe: 'response', withCredentials: true })
      .pipe(
        tap((response) => {
          localStorage.clear();
        })
      );
  }

}
