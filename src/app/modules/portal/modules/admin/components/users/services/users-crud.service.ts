import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../../../../../../../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class UserCrudService {

  private apiUrl = `http://184.168.64.136/api/rpc`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  private getHeaders() {
    const token = this.tokenService.getToken() // Asegúrate de que el token esté en sessionStorage
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cookie': `auth-token=${token}` // Agrega la cookie con el token
    });
    return { headers };
  }

  listUsers(): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_users'
    };
    return this.http.post<any>(this.apiUrl, payload, this.getHeaders());
  }


}
