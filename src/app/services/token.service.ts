import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // Método para guardar el token en sessionStorage
  saveToken(token: string): void {
    sessionStorage.setItem('auth-token', token);
  }

  // Método para obtener el token desde sessionStorage
  getToken(): string | null {
    return sessionStorage.getItem('auth-token');
  }

  // Método para eliminar el token (logout)
  clearToken(): void {
    sessionStorage.removeItem('auth-token');
  }

  // Método para verificar si el token está presente
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
