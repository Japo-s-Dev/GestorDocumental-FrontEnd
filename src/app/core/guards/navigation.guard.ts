import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationGuard implements CanActivate {
  private validPaths: string[] = []; // Lista de rutas permitidas dinámicamente

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const attemptedUrl = state.url;

    // Verificar si la ruta está permitida
    if (this.validPaths.includes(attemptedUrl)) {
      return true;
    }

    // Si no está permitida, redirigir al login u otra ruta
    this.router.navigate(['/login']);
    return false;
  }

  /**
   * Agregar una ruta como válida.
   */
  allowPath(path: string): void {
    if (!this.validPaths.includes(path)) {
      this.validPaths.push(path);
    }
  }

  /**
   * Limpiar las rutas válidas (ejemplo: al hacer logout).
   */
  clearValidPaths(): void {
    this.validPaths = [];
  }
}
