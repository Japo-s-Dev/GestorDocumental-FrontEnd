import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../../../../../../../enums/app.constants';


@Injectable({
  providedIn: 'root'
})
export class UserCrudService {

  private apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  constructor(private http: HttpClient) {}

  // Crear Usuario
  createUser(data: { username: string, pwd_clear: string, email: string }): Observable<any> {
    const payload = {
      id: 1,
      method: 'create_user',
      params: {
        data
      }
    };
    return this.http.post<any>(this.apiUrl, payload, this.getHeaders());
  }

  // Eliminar Usuario
  deleteUser(userId: number): Observable<any> {
    const payload = {
      id: 1,
      method: 'delete_user',
      params: {
        id: userId
      }
    };
    return this.http.post<any>(this.apiUrl, payload, this.getHeaders());
  }

  // Listar Usuarios
  listUsers(): Observable<any> {
    const payload = {
      id: 1,
      method: 'list_users'
    };
    return this.http.post<any>(this.apiUrl, payload, this.getHeaders());
  }

  // Actualizar Usuario
  updateUser(userId: number, data: { username?: string, email?: string }): Observable<any> {
    const payload = {
      id: 1,
      method: 'update_user',
      params: {
        id: userId,
        data
      }
    };
    return this.http.post<any>(this.apiUrl, payload, this.getHeaders());
  }

  // Método para obtener los headers comunes
  private getHeaders() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return { headers };
  }
}
