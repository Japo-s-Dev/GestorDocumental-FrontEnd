import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LogOffRequest } from '../interfaces/login-request.interface';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private logoutTimer: any;
  private readonly INACTIVITY_LIMIT = 15 * 60 * 1000;


  constructor( private router: Router,
     private ngZone: NgZone,
     private authService: AuthService

    ) {
    this.setupActivityListeners();
  }

  private setupActivityListeners(): void {
    this.resetLogoutTimer();
    const events = ['mousemove', 'keydown', 'click'];

    events.forEach(event => {
      window.addEventListener(event, () => this.resetLogoutTimer());
    });
  }

  private resetLogoutTimer(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    this.logoutTimer = setTimeout(() => {
      this.ngZone.run(() => this.handleLogout());
    }, this.INACTIVITY_LIMIT);
  }

  private handleLogout(): void {
    const logOffRequest: LogOffRequest = {
      logoff: true,
    };

    this.authService.logoff(logOffRequest).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error during logoff:', error);
      }
    });
  }
}
