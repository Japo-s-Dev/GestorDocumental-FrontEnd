import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // Método para guardar el token en localStorage o sessionStorage
  saveToken(token: string): void {
    localStorage.setItem('auth-token', token);
  }

  // Método para obtener el token desde localStorage o sessionStorage
  getToken(): string | null {
    return localStorage.getItem('auth-token');
  }

  // Método para eliminar el token (logout)
  clearToken(): void {
    localStorage.removeItem('auth-token');
  }

  // Método para verificar si el token está presente
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
