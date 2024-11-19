import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../interfaces/login-request.interface';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from '../../services/loader.service';
import { NavigationGuard } from '../../core/guards/navigation.guard'; // Importar el guard

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true;
  alertVisible = false;
  alertTitle = '';
  alertMessage = '';
  alertType = 'alert-danger';
  alertIcon = 'icon-danger';
  currentLanguage: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    public translate: TranslateService,
    private loaderService: LoaderService,
    private navigationGuard: NavigationGuard // Inyectar el guard
  ) {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'es';
    this.currentLanguage = savedLanguage;
    this.translate.setDefaultLang(savedLanguage);
    this.translate.use(savedLanguage);
  }

  toggleVisibility(): void {
    this.hide = !this.hide;
  }

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  login() {
    const loginRequest: LoginRequest = {
      username: this.loginForm.value.username ?? '',
      pwd: this.loginForm.value.password ?? ''
    };

    this.authService.login(loginRequest).subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.body.result && response.body.result.success) {
          localStorage.setItem('userStatus', JSON.stringify({
            username: response.body.result.username,
            role: response.body.result.role
          }));

          const currentDateTime = new Date().toLocaleString();
          localStorage.setItem('lastLogin', currentDateTime);
          localStorage.removeItem('selectedProject');

          // Agregar rutas permitidas dinámicamente
          this.navigationGuard.allowPath('/portal');
          this.navigationGuard.allowPath('/portal/document-management/expedient-list');
          this.navigationGuard.allowPath('/portal/admin/users');

          this.loaderService.showLoader();

          // Navegar a la ruta permitida
          this.router.navigate(['/portal/document-management/expedient-list']);
        } else {
          this.showAlert('Error', 'Credenciales incorrectas', 'danger');
          this.loaderService.hideLoader();
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.showAlert('Error', 'Credenciales incorrectas', 'danger');
        } else {
          this.showAlert('Error', 'Error interno del servidor', 'danger');
        }
        this.loaderService.hideLoader();
      }
    });
  }

  showAlert(title: string, message: string, type: 'success' | 'warning' | 'danger' | 'info'): void {
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertType = `alert-${type}`;
    this.alertIcon = `fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'times-circle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'}`;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
    }, 10000);
  }

  handleAlertClosed(): void {
    this.alertVisible = false;
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.currentLanguage = language;
    localStorage.setItem('selectedLanguage', language);
  }
}
