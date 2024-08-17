import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest } from '../interfaces/login-request.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = `https://server.evoluciona.com.gt/api/login`;

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.loginUrl, loginRequest, { headers, observe: 'response', withCredentials: true })
      .pipe(
        tap((response) => {
          // Browser will handle cookies, check for success and route accordingly
          console.log('Login successful, response:', response);
        })
      );
  }
}
