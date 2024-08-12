import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private logoutTimer: any;
  private readonly INACTIVITY_LIMIT = 15 * 60 * 1000;


  constructor(private tokenService: TokenService, private router: Router, private ngZone: NgZone) {
    this.setupActivityListeners();
  }

  private setupActivityListeners(): void {
    this.resetLogoutTimer(); // Inicializar el temporizador
    const events = ['mousemove', 'keydown', 'click'];

    events.forEach(event => {
      window.addEventListener(event, () => this.resetLogoutTimer());
    });
  }

  // Reiniciar el temporizador de inactividad
  private resetLogoutTimer(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    this.logoutTimer = setTimeout(() => {
      this.ngZone.run(() => this.handleLogout());
    }, this.INACTIVITY_LIMIT);
  }

  private handleLogout(): void {
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
    alert('Has sido desconectado por inactividad.');
  }
}
