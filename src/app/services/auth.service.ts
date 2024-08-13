import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest } from '../interfaces/login-request.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = `http://127.0.0.1:8080/api/login`;

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.loginUrl, loginRequest, { headers, observe: 'response', withCredentials: true })
      .pipe(
        tap((response) => {
          // Extraer la cookie manualmente
          //const cookies = response.headers.get('set-cookie');
          //if (cookies) {
          //  const authToken = this.getCookieFromString(cookies, 'auth-token');
          //  if (authToken) {
          //    sessionStorage.setItem('auth-token', authToken); // Guarda el token en sessionStorage
          //  }
          //}
          console.log(response)
        })
      );
  }

  // Función para extraer la cookie específica del string de cookies
  private getCookieFromString(cookieString: string, cookieName: string): string | null {
    const cookiesArray = cookieString.split(';');
    for (const cookie of cookiesArray) {
      const [name, value] = cookie.trim().split('=');
      if (name === cookieName) {
        return value;
      }
    }
    return null;
  }
}
